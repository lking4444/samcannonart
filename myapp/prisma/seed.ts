import { createPrint } from '@/lib/db/prints';
import { createCard } from '../lib/db/cards';
import {prisma} from '../lib/prisma'
import { createCalendar } from '@/lib/db/calendars';
import { createNotepad } from '@/lib/db/notepads';
import { createOriginal } from '@/lib/db/originals';
import { createGift } from '@/lib/db/gifts';
import { createSlate } from '@/lib/db/slates';

async function main() {

    await prisma.item.deleteMany();

    // await createCard({
    //     name: 'Blue Meadow',
    //     image: '/Images/Art/image2.png',
    //     price: '3.50',
    //     stock: 20,
    //     dimensions: '10x15',
    //     media: 'Watercolour',
    //     description: 'A calm meadow scene',
    //     year: 2023,
    //     cardId: 'SQ-001',
    //   });
      
    //   await createCard({
    //     name: 'Blue Night',
    //     image: '/Images/Art/image3.png',
    //     price: '3.50',
    //     stock: 22,
    //     dimensions: '20x15',
    //     media: 'Watercolour',
    //     description: 'A calm evening scene',
    //     year: 2023,
    //     cardId: 'SQ-002',
    //   });
      
    //   await createCard({
    //     name: 'Golden Fields',
    //     image: '/Images/Art/image4.png',
    //     price: '4.00',
    //     stock: 18,
    //     dimensions: '15x15',
    //     media: 'Ink and wash',
    //     description: 'Rolling fields under warm light',
    //     year: 2022,
    //     cardId: 'SQ-003',
    //   });
      
    //   await createCard({
    //     name: 'Quiet Shore',
    //     image: '/Images/Art/image5.png',
    //     price: '4.00',
    //     stock: 25,
    //     dimensions: '10x14',
    //     media: 'Watercolour',
    //     description: 'A peaceful shoreline at dusk',
    //     year: 2024,
    //     cardId: 'SQ-004',
    //   });
      
    //   await createCard({
    //     name: 'Morning Light',
    //     image: '/Images/Art/image6.png',
    //     price: '3.75',
    //     stock: 30,
    //     dimensions: '12x18',
    //     media: 'Watercolour',
    //     description: 'Soft morning light over hills',
    //     year: 2024,
    //     cardId: 'SQ-005',
    //   });
      
    //   await createCard({
    //     name: 'Autumn Path',
    //     image: '/Images/Art/image7.png',
    //     price: '4.25',
    //     stock: 16,
    //     dimensions: '10x15',
    //     media: 'Ink and watercolour',
    //     description: 'A winding path through autumn trees',
    //     year: 2023,
    //     cardId: 'SQ-006',
    //   });
      
    //   await createCard({
    //     name: 'Sea Breeze',
    //     image: '/Images/Art/image2.png',
    //     price: '3.75',
    //     stock: 21,
    //     dimensions: '14x14',
    //     media: 'Watercolour',
    //     description: 'A breezy coastal scene',
    //     year: 2022,
    //     cardId: 'SQ-007',
    //   });
      
    //   await createCard({
    //     name: 'Evening Glow',
    //     image: '/Images/Art/image3.png',
    //     price: '4.00',
    //     stock: 19,
    //     dimensions: '15x20',
    //     media: 'Watercolour',
    //     description: 'Warm glow over a quiet town',
    //     year: 2023,
    //     cardId: 'SQ-008',
    //   });
      
    //   await createCard({
    //     name: 'Forest Stillness',
    //     image: '/Images/Art/image4.png',
    //     price: '3.25',
    //     stock: 14,
    //     dimensions: '10x15',
    //     media: 'Ink',
    //     description: 'A still forest interior',
    //     year: 2021,
    //     cardId: 'SQ-009',
    //   });
      
    //   await createCard({
    //     name: 'Soft Rain',
    //     image: '/Images/Art/image5.png',
    //     price: '3.75',
    //     stock: 28,
    //     dimensions: '12x16',
    //     media: 'Watercolour',
    //     description: 'Rain falling gently across rooftops',
    //     year: 2024,
    //     cardId: 'SQ-010',
    //   });
      
    //   await createCard({
    //     name: 'Hilltop View',
    //     image: '/Images/Art/image6.png',
    //     price: '4.00',
    //     stock: 17,
    //     dimensions: '15x15',
    //     media: 'Watercolour',
    //     description: 'A wide view from a hilltop',
    //     year: 2022,
    //     cardId: 'SQ-011',
    //   });
      
    //   await createCard({
    //     name: 'Winter Quiet',
    //     image: '/Images/Art/image7.png',
    //     price: '3.25',
    //     stock: 12,
    //     dimensions: '10x14',
    //     media: 'Ink and wash',
    //     description: 'A quiet winter landscape',
    //     year: 2021,
    //     cardId: 'SQ-012',
    //   });
      
    //   await createCard({
    //     name: 'Spring Lane',
    //     image: '/Images/Art/image2.png',
    //     price: '3.75',
    //     stock: 26,
    //     dimensions: '12x18',
    //     media: 'Watercolour',
    //     description: 'A lane blooming with spring flowers',
    //     year: 2024,
    //     cardId: 'SQ-013',
    //   });
      
    //   await createCard({
    //     name: 'Low Tide',
    //     image: '/Images/Art/image3.png',
    //     price: '4.00',
    //     stock: 20,
    //     dimensions: '14x18',
    //     media: 'Watercolour',
    //     description: 'Shoreline revealed at low tide',
    //     year: 2022,
    //     cardId: 'SQ-014',
    //   });
      
    //   await createCard({
    //     name: 'Hidden Garden',
    //     image: '/Images/Art/image4.png',
    //     price: '4.25',
    //     stock: 15,
    //     dimensions: '10x15',
    //     media: 'Ink and watercolour',
    //     description: 'A secluded garden space',
    //     year: 2023,
    //     cardId: 'SQ-015',
    //   });
      
    //   await createCard({
    //     name: 'Distant Hills',
    //     image: '/Images/Art/image5.png',
    //     price: '3.75',
    //     stock: 23,
    //     dimensions: '15x20',
    //     media: 'Watercolour',
    //     description: 'Hills fading into the distance',
    //     year: 2022,
    //     cardId: 'SQ-016',
    //   });
      
    //   await createCard({
    //     name: 'City Haze',
    //     image: '/Images/Art/image6.png',
    //     price: '3.50',
    //     stock: 18,
    //     dimensions: '12x16',
    //     media: 'Ink',
    //     description: 'A city softened by haze',
    //     year: 2021,
    //     cardId: 'SQ-017',
    //   });
      
    //   await createCard({
    //     name: 'Sunlit Path',
    //     image: '/Images/Art/image7.png',
    //     price: '4.00',
    //     stock: 27,
    //     dimensions: '10x15',
    //     media: 'Watercolour',
    //     description: 'Sunlight falling across a path',
    //     year: 2024,
    //     cardId: 'SQ-018',
    //   });
      
    //   await createCard({
    //     name: 'Quiet Harbour',
    //     image: '/Images/Art/image2.png',
    //     price: '3.75',
    //     stock: 16,
    //     dimensions: '14x14',
    //     media: 'Watercolour',
    //     description: 'Boats resting in a quiet harbour',
    //     year: 2023,
    //     cardId: 'SQ-019',
    //   });
      
    //   await createCard({
    //     name: 'Fading Light',
    //     image: '/Images/Art/image3.png',
    //     price: '3.50',
    //     stock: 19,
    //     dimensions: '15x18',
    //     media: 'Watercolour',
    //     description: 'Light fading at the end of the day',
    //     year: 2022,
    //     cardId: 'SQ-020',
    //   });   
      // ===== CARDS =====
  // ===== PRINTS =====
  await createPrint({
    name: 'Golden Valley',
    image: '/Images/Art/image2.png',
    price: '18.00',
    stock: 10,
    dimensions: '30x40',
    media: 'Giclée print',
    description: 'A warm valley landscape',
    year: 2023,
    printId: 'PR-001',
  });
  
  await createPrint({
    name: 'Still Water',
    image: '/Images/Art/image4.png',
    price: '22.50',
    stock: 6,
    dimensions: '40x50',
    media: 'Archival ink print',
    description: 'Reflections on calm water',
    year: 2022,
    printId: 'PR-002',
  });
  
  await createPrint({
    name: 'Evening Sky',
    image: '/Images/Art/image7.png',
    price: '20.00',
    stock: 8,
    dimensions: '35x45',
    media: 'Fine art print',
    description: 'Soft colours at dusk',
    year: 2024,
    printId: 'PR-003',
  });
  
  // ===== CALENDARS =====
  await createCalendar({
    name: 'Seasons 2025',
    image: '/Images/Art/image1.png',
    price: '12.00',
    stock: 40,
    dimensions: 'A4',
    media: 'Printed calendar',
    description: 'Twelve seasonal illustrations',
    year: 2025,
  });
  
  await createCalendar({
    name: 'Coastal Year',
    image: '/Images/Art/image6.png',
    price: '14.00',
    stock: 25,
    dimensions: 'A3',
    media: 'Printed calendar',
    description: 'Coastal scenes through the year',
    year: 2025,
  });
  
  await createCalendar({
    name: 'Quiet Landscapes',
    image: '/Images/Art/image3.png',
    price: '11.50',
    stock: 30,
    dimensions: 'A4',
    media: 'Printed calendar',
    description: 'Soft and minimal landscapes',
    year: 2024,
  });
  
  // ===== NOTEPADS =====
  await createNotepad({
    name: 'Field Notes',
    image: '/Images/Art/image4.png',
    price: '6.50',
    stock: 50,
    dimensions: 'A5',
    media: 'Printed paper',
    description: 'Lined notebook with artwork cover',
    year: 2024,
    notePadName: 'FIELD-NOTES',
  });
  
  await createNotepad({
    name: 'Studio Sketches',
    image: '/Images/Art/image2.png',
    price: '7.00',
    stock: 40,
    dimensions: 'A5',
    media: 'Recycled paper',
    description: 'Blank pages for sketching',
    year: 2023,
    notePadName: 'STUDIO-SKETCH',
  });
  
  await createNotepad({
    name: 'Daily Thoughts',
    image: '/Images/Art/image7.png',
    price: '6.00',
    stock: 60,
    dimensions: 'A6',
    media: 'Printed paper',
    description: 'Compact everyday notebook',
    year: 2024,
    notePadName: 'DAILY-THOUGHTS',
  });
  
  // ===== ORIGINALS =====
  // await createOriginal({
  //   name: 'Silent Horizon',
  //   image: '/Images/Art/image5.png',
  //   price: '240.00',
  //   stock: 1,
  //   dimensions: '50x70',
  //   media: 'Watercolour on paper',
  //   description: 'Original landscape painting',
  //   year: 2022,
  // });
  
  // await createOriginal({
  //   name: 'Winter Stillness',
  //   image: '/Images/Art/image1.png',
  //   price: '320.00',
  //   stock: 1,
  //   dimensions: '60x80',
  //   media: 'Ink and wash on paper',
  //   description: 'Minimal winter scene',
  //   year: 2023,
  // });
  
  // await createOriginal({
  //   name: 'Low Light',
  //   image: '/Images/Art/image6.png',
  //   price: '280.00',
  //   stock: 1,
  //   dimensions: '55x75',
  //   media: 'Mixed media on paper',
  //   description: 'Soft evening tones',
  //   year: 2024,
  // });
  
  // ===== GIFTS =====
  await createGift({
    name: 'Pebble Set',
    image: '/Images/Art/image3.png',
    price: '15.00',
    stock: 20,
    dimensions: '',
    media: 'Painted stone',
    description: 'Hand-painted pebble gift set',
    year: 2023,
    giftNumber: 'G-001',
    giftType: 'PEBBLES',
  });
  
  await createGift({
    name: 'Tiny Pebble Trio',
    image: '/Images/Art/image2.png',
    price: '10.00',
    stock: 35,
    dimensions: "",
    media: 'Painted stone',
    description: 'Small decorative pebble trio',
    year: 2024,
    giftNumber: 'G-002',
    giftType: 'TINYPEBBLES',
  });
  
  await createGift({
    name: 'Mixed Media Keepsake',
    image: '/Images/Art/image7.png',
    price: '22.00',
    stock: 12,
    dimensions: "",
    media: 'Mixed media',
    description: 'Unique handcrafted keepsake',
    year: 2022,
    giftNumber: 'G-003',
    giftType: 'MIXEDMEDIA',
  });
  
  // ===== SLATES =====
  await createSlate({
    name: 'Slate Shore',
    image: '/Images/Art/image4.png',
    price: '28.00',
    stock: 8,
    dimensions: '20x20',
    media: 'Painted slate',
    description: 'Coastal scene on natural slate',
    year: 2023,
  });
  
  await createSlate({
    name: 'Quiet Stone',
    image: '/Images/Art/image1.png',
    price: '32.00',
    stock: 5,
    dimensions: '25x25',
    media: 'Ink on slate',
    description: 'Minimal ink work on slate',
    year: 2022,
  });
  
  await createSlate({
    name: 'Edge of Light',
    image: '/Images/Art/image6.png',
    price: '30.00',
    stock: 6,
    dimensions: '22x22',
    media: 'Mixed media on slate',
    description: 'Subtle light and texture',
    year: 2024,
  });
  
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });