// scripts/fix-duplicate-card-images.mjs
// Fixes duplicate card visuals per category.
// Strategy: when `banner` is duplicated, fall back to `image`.
// When both are duplicated, pull a fresh YouTube ID from the pool.
// Usage: node scripts/fix-duplicate-card-images.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';

const YOUTUBE_POOL = {
  anime: [
    'VQGCKyvzIM4','x7uLutVRBfI','pkKu9hLT-t8','3xNH23QkNpk',
    'S-XxKVxZ2fU','EfQ04f74k_g','Hb57fdPj7LU','bssSj4cKsrI',
    'OOmRInABehI','NlJZ-YgAt-c','KeeY2W7phbM','j9sSzNmB5po',
    'TRr_dS2REo4','9QyiEgv33z4','-GoNo0DGroU','Iwr1aLEDpe4',
    '0XJxfbN36Uw','f8JrZ7Q_p-8','EeCX8Y0a278','vGuQeQsoRgU',
    'EQ-DKvLQlyQ','22R0j8UKRzY','Y8JFxS1HlDo','j3DuONZb3Ik',
    'eY-rwYyWolM','a9tq0aS5Zu8','PraFso1sVIc','d7cchDzww_0',
    'sAU6Istwz6c','Jd_B6ox3qGc','1Id_f3GDlus','1bN9t6WE5WQ',
    '2Bh7WwjIex0','pZVfO0jwua8','wxKTRwrm8Cg','GJNYSWR-oL8',
    'Z23db3nlVSY','R0-UGX6faWE','hc95ajRd_m0','FU9-3Fmoh7w',
    'dNZV3K7orZk','QbaFu1hEPtU','PO5OOi1kWqo','KCG0wBFr3z8',
  ],
  gaming: [
    'VQRLujxTm3c','nBwxyqq1ON4','U8lJRcUeEMs','QkkoHAzjnUs',
    'hLQl3WQQoQ0','2gUtfBmw86Y','4f1w8lWFv5Y','0sRjMQoYTNM',
    'hY5D5fSqYFU','eaW0tYpxyp0','9pGKTzVdCLE','qLZenOn7WUo',
    '54dabgZJ5YA','8X2kIfS6fb8','vovkzbtYBC8','POz1-EmLsTY',
    'QVctog5F_jY','A0Hw96M5bC4','LKw_2rj7hLc','IGk17XQ7IrQ',
    'E3Huy2cdih0','BO8lX3hDU30','t_kxkRnq4Qg','RYKMn8wWd1Y',
    'XE5xZSd-lzk','q_ajc87CDs0','tW3ZVQiOtyc','GCWkjdE8TQw',
    'mxHIFijxTZY','jwerp2SNiTQ','P42Zb3ZvHk0','Dw_oH5oiUSE',
    'UEIqHfLggaA','oYlsmbxTVM4','tJbzMqJGH4k','kDPqQo4N9SU',
    'SzS8Ao0H6Co','x8jAY2CoOBg','MmB9b5njVbA',
  ],
  movies: [
    'TcMBFSGVi1c','mqqft2x_Aa4','JfVOs4VSpmA','Ox8ZLF6cGM0',
    'SJVmeJaS44s','x8UAUAuKNcU','sGbxmsDFVnE','RFinNxS5KN4',
    'zSWdZVtXT7E','zAGVQLHvwOY','nb_fFj_0rq8','HZ7PAyCDwEg',
    'iTOaFootkSk','IPf4rGw3XHw','22w7z_lT6YM','itnqEauWQZM',
    'mfmrPu43DF8','k10ETZ41q5o','NOhDyUmT9z0','L0MK7qz13bU',
    'EXeTwQWrcwY','JwkSl18XQOE','u843KNE-exo','tGR4OMpMTQU',
    'J_fzAoflOzI','fY9UhIxitYM','mGBshW61EC0','j3DuONZb3Ik',
    'nmrqYcw_xsE','V7h01x1oiQs','tJAZ35-EO1s',
  ],
  'tv-shows': [
    'PssKpzB0Ah0','a3thyAnShck','rlR4PJn8b8I','bjqEWgDVPe0',
    'HhesaQXLuRY','2gTC4uWP3_Y','qwOWJ8pPgk8','cu2ApTImBKc',
    '_zHPsmXCjB0','uLtkt8BonwM','03u4xyj0TH4','Di310WS8zLk',
    'EzFXDvC-EwM','M1bhOaLV4FU','YN2H_sKcmGw','DotnJ7tTA34',
    'SzS8Ao0H6Co','ndl1W4ltcmg','PxZ5gGfPtCQ','lcvUGs3xaDM',
    '1FhmnB6SwBc','_InqQJRqGW4','Ed1sGgHUo88','oqxAJKy0ii4',
    'Qz3u06eXf0E','HN4oydykJFc','cq2iTHoLrt0','ESEUoa-mz2c',
    '_n8ge-ROJ54','8AjLfJJIyrg','s0LVj0yo308','0DAmWHxeoKw',
    'm0aa_JaA-c8','lkaIYfA1WOs','Znsa4Deavgg','aOC8E8z_ifw',
    'jAy6NJ_D5vU','R-B-7hGihts','JZx887udEnM','5SKP1_F7ReE',
  ],
  kpop: [
    'gdZLi9oWNZg','WMweEpGlu_U','CuklIb9d3fI','ioNng23DkIM',
    'gQlMMD8auMs','POe9SOEK6fA','kOHB85vDuow','CM4CkVFmTds',
    'TQTlCHxyuu8','JsOOis4bBF8','11cta61wi0g','pSUydWEqKwE',
    '-GQg25oP0S4','Y8JFxS1HlDo','6ZUIwj3FgUY','4TWR90KJl84',
    'phuiiNCxRMg','4vbDFu0PUew','KSH-FVVtTf0','uR8Mrt1IpXg',
    'pNfTK39k55U','Jh4QFaPmdss','Z_BhMhZpAug','2wA_b6YHjqQ',
    'Vk5-c_v4gMU','iUw3LPM7OBU','nQ6wLuYvGd4','P9tKTxbgdkk',
    'wXFLzODIdUI','UBURTj20HXI','0TAAUWHo4Ec','R9At2ICm4LQ',
    'fE2h3lGlOsk','7HDeem-JaSY','2HcVZm_4qAI','olDWm2veCrM',
    'UCmgGZbfjmk','pSudEWBAYRE','zSQ48zyWZrY','DiHUEWBRQEI',
  ],
  comics: [
    'pv3Ss8o9gGQ','TcMBFSGVi1c','JfVOs4VSpmA','18QQWa5MEcs',
    'u3V5KDHRQvk','7xALolZzhSM','8ugaeA-nMTc','1pHDWnXmK7Y',
    'tgB1wUcmbbw','_Z3QKkl1WyM','oTXrl8H6luI','mqqft2x_Aa4',
    'Ox8ZLF6cGM0','sfM7_JLk-84','hebWYacbdvc','_axLoYlwwmU',
    'r9WhJyyTtqo','eg5ciqQzmK0','EzFXDvC-EwM','zymgtV99Rko',
    '6ZfuNTqbHE8','cqGjhVJWtEg','PfBVIHgQbYk','d96cjJhvlMA',
    'dKrVegVI0Us','ue80QwXMRHg','xjDjIWPwcPU','3cxixDgHUYw',
    'wglmbroElU0','T6DJcgm3wNY','1Q8fG0TtVAY','2mW6nJ_e0P4',
    'Trb82wYnGg4','ctM8zpe3BHo','CmRih_VtVAs','EXeTwQWrcwY',
    'Ke1Y3P9D0Bc','_rRoD28-WgU',
  ],
  manga: [
    'S-XxKVxZ2fU','22R0j8UKRzY','Hb57fdPj7LU','NlJZ-YgAt-c',
    'pkKu9hLT-t8','VQGCKyvzIM4','j9sSzNmB5po','3xNH23QkNpk',
    '-GoNo0DGroU','f8JrZ7Q_p-8','KeeY2W7phbM','vGuQeQsoRgU',
    'Iwr1aLEDpe4','bssSj4cKsrI','OOmRInABehI','TRr_dS2REo4',
    '9QyiEgv33z4','EeCX8Y0a278','EQ-DKvLQlyQ','0XJxfbN36Uw',
    'O8r0N1X2XHU','EfQ04f74k_g','3Gmo0EXHyKg','QczGoCmX-pI',
    'IHt9-tKJbXk','B9LrnHwbFlc','8xlKfcyI0VY','O0b1F4_5Y6M',
    'h4zGN9iTK2s','tZ0q6g9Z41s','1sRlJOMxPjU','Zt2mR_eHOh4',
    'Pb1a9a2pLPQ','LoBU1YdRxTU','m4q3ZQBR4vY','8Y4QYD-gFyQ',
  ],
};

async function main() {
  console.log('📖 Reading content.json...\n');
  const data = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  const usedVisuals = {};
  const usedImages = {};

  let bannerFixes = 0;
  let imageFixes = 0;
  const report = [];

  data.content = data.content.map((a) => {
    const cat = a.category;
    if (!usedVisuals[cat]) usedVisuals[cat] = new Set();
    if (!usedImages[cat]) usedImages[cat] = new Set();

    let banner = a.banner;
    let image = a.image;
    let visual = banner || image;

    if (!visual) return a;

    if (usedVisuals[cat].has(visual)) {
      if (image && !usedImages[cat].has(image) && image !== visual) {
        report.push(`  ✓ ${cat}/${a.id}: banner → image (unique)`);
        banner = image;
        visual = image;
        bannerFixes++;
      } else {
        const pool = YOUTUBE_POOL[cat] || [];
        const freshId = pool.find(
          (id) =>
            !usedImages[cat].has(
              `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
            )
        );
        if (freshId) {
          const freshUrl = `https://img.youtube.com/vi/${freshId}/maxresdefault.jpg`;
          report.push(`  ✓ ${cat}/${a.id}: reassigned → ${freshId}`);
          image = freshUrl;
          banner = freshUrl;
          visual = freshUrl;
          imageFixes++;
        } else {
          console.log(`  ⚠ ${cat}/${a.id}: pool exhausted, skipped`);
        }
      }
    }

    if (visual) usedVisuals[cat].add(visual);
    if (image) usedImages[cat].add(image);

    return { ...a, banner, image };
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log('\n✨ Done!\n');
  console.log(`   Banner fixes: ${bannerFixes}`);
  console.log(`   Image fixes:  ${imageFixes}`);
  console.log(`   Total fixes:  ${bannerFixes + imageFixes}`);

  if (report.length > 0 && report.length <= 80) {
    console.log('\n📋 Changes:');
    report.forEach((r) => console.log(r));
  } else if (report.length > 80) {
    console.log(`\n📋 First 80 of ${report.length} changes:`);
    report.slice(0, 80).forEach((r) => console.log(r));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});