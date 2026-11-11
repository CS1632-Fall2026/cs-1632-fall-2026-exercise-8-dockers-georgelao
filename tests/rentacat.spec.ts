import { test, expect } from '@playwright/test';

// Fixture: Open URL and reset cookies, for all test
test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080');
  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=false";
    document.cookie = "3=false";
  });
});

test('TEST-1-RESET', async ({ page }) => {
  // Precondition: All cats rented
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  await page.click('text=Reset');

  // Verify cats are available 
  const listItems = page.locator('ul').nth(1).locator('li');
  await expect(listItems.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listItems.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listItems.nth(2)).toHaveText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.click('text=Catalog');
  const catalogItems = page.locator('ol > li');
  await expect(catalogItems.nth(1).locator('img')).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.click('text=Catalog');

  // Verify 3 items, 3rd is Mistoffelees
  const listItems = page.locator('ul').nth(1).locator('li');
  await expect(listItems).toHaveCount(3);
  await expect(listItems.nth(2)).toHaveText('ID 3. Mistoffelees');
});


test('TEST-5-RENT', async ({ page }) => {
  await page.click('text=Rent-A-Cat');
  
  // Fill 1st input (Rent) and click
  await page.locator('input').nth(0).fill('1'); 
  await page.click('button:has-text("Rent")');

  // Verify list updates and success message
  const listItems = page.locator('ul').nth(1).locator('li');
  await expect(listItems.nth(0)).toHaveText('Rented out');
  await expect(listItems.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listItems.nth(2)).toHaveText('ID 3. Mistoffelees');
  await expect(page.locator('text=Success!')).toBeVisible();
});

test('TEST-6-RETURN', async ({ page }) => {
  // Precondition: Cats 2 and 3 rented
  await page.evaluate(() => {
    document.cookie = "2=true";
    document.cookie = "3=true";
  });

  await page.click('text=Rent-A-Cat');
  
  // Fill 2nd input (Return) and click
  await page.locator('input').nth(1).fill('2'); 
  await page.click('button:has-text("Return")');

  // Verify list updates and success message
  const listItems = page.locator('ul').nth(1).locator('li');
  await expect(listItems.nth(0)).toHaveText('ID 1. Jennyanydots');
  await expect(listItems.nth(1)).toHaveText('ID 2. Old Deuteronomy');
  await expect(listItems.nth(2)).toHaveText('Rented out');
  await expect(page.locator('text=Success!')).toBeVisible();
});








