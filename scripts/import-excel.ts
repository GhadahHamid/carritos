import 'dotenv/config';
import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import FormData from 'form-data';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();
const EXCHANGE_RATE = 89000; 

const EXCEL_FILE_PATH = 'C:\\Users\\Psylocke\\Desktop\\data\\data_final_ready.xlsx';
const IMAGES_FOLDER = 'C:\\Users\\Psylocke\\Desktop\\data\\Product_Images';
const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

// Function to upload image to ImgBB
async function uploadToImgBB(filePath: string) {
  const form = new FormData();
  form.append('image', fs.createReadStream(filePath));

  const response = await axios.post(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    form,
    { headers: form.getHeaders() }
  );

  return response.data.data.url;
}

async function main() {
  console.log(`📂 Reading Excel from: ${EXCEL_FILE_PATH}`);
  
  if (!fs.existsSync(EXCEL_FILE_PATH)) {
    console.error("❌ Excel file not found!");
    return;
  }
  
  if (!IMGBB_API_KEY) {
    console.error("❌ IMGBB_API_KEY is missing in your .env file!");
    return;
  }

  const workbook = XLSX.readFile(EXCEL_FILE_PATH);
  const sheetName = workbook.SheetNames[0];
  const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  let addedCount = 0;
  let skippedCount = 0;
  let availableImages: string[] = [];

  if (fs.existsSync(IMAGES_FOLDER)) {
    availableImages = fs.readdirSync(IMAGES_FOLDER);
  }

  for (const row of data as any[]) {
    const name = row['Name']?.toString().trim();
    const barcode = row['Barcode']?.toString().trim();
    const categoryName = row['AI_Category']?.toString().trim() || 'Other';
    const purchCurr = row['Purch. Curr.']?.toString().trim().toUpperCase();
    
    let rawPrice = parseFloat(row['Retail Price']);
    if (isNaN(rawPrice) || rawPrice === 0) {
      rawPrice = parseFloat(row['All Price']);
    }
    
    if (!name || isNaN(rawPrice) || rawPrice === 0) {
      skippedCount++;
      continue;
    }

    let finalPriceUSD = rawPrice;
    if (purchCurr === 'LBP') {
      finalPriceUSD = rawPrice / EXCHANGE_RATE;
    }
    finalPriceUSD = Math.round(finalPriceUSD * 100) / 100;

    try {
      // Category setup
      const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
      let category = await prisma.category.findUnique({ where: { slug } });
      if (!category) {
        category = await prisma.category.create({ data: { name: categoryName, slug } });
      }

      // Image mapping and uploading
      let imageUrl = null;
      const foundImage = availableImages.find(img => {
        const fileNameWithoutExt = img.split('.')[0].toLowerCase();
        return fileNameWithoutExt === name.toLowerCase() || fileNameWithoutExt === barcode?.toLowerCase();
      });

      if (foundImage) {
        const fullImagePath = path.join(IMAGES_FOLDER, foundImage);
        console.log(`📤 Uploading image for ${name}...`);
        try {
            imageUrl = await uploadToImgBB(fullImagePath);
          } catch (uploadError: any) {
            console.log(`⚠️ Failed to upload ${name}:`, uploadError.response?.data || uploadError.message);
          }
      }

      // Save to Database
      await prisma.product.create({
        data: {
          name: name,
          barcode: barcode || null,
          price: finalPriceUSD,
          costPrice: 0, 
          stock: 10, 
          imageUrl: imageUrl,
          categoryId: category.id,
        }
      });

      console.log(`✅ ${name} | $${finalPriceUSD} | Img: ${imageUrl ? 'Uploaded' : 'None'}`);
      addedCount++;

    } catch (error: any) {
      console.error(`❌ Error saving ${name}:`, error.message);
    }
  }

  console.log(`\n🎉 Done! Added ${addedCount}. Skipped: ${skippedCount}.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());