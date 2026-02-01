import { test, expect } from '@playwright/test';

test('Vue Demo Walkthrough', async ({ page }) => {
    // 1. Home Page
    await page.goto('http://localhost:5173');
    await expect(page.getByText('Design. Print. Track Everything.')).toBeVisible();
    await page.waitForTimeout(1500); // Pause for demo effect

    // 2. Labels View
    await page.getByRole('link', { name: 'Start Designing' }).click();
    await expect(page).toHaveURL(/.*\/labels/);
    await expect(page.getByText('Label Templates')).toBeVisible();
    await page.waitForTimeout(1000);

    // 3. Designer (Create New)
    await page.getByRole('button', { name: 'Create New Label' }).click();
    await expect(page).toHaveURL(/.*\/designer/);
    await page.waitForTimeout(2000); // Let them see the canvas
    await page.getByRole('button', { name: 'Back to Labels' }).click();

    // 4. Employees View
    await page.getByRole('link', { name: 'Employees' }).click();
    await expect(page).toHaveURL(/.*\/employees/);
    await page.waitForTimeout(1000);

    // Add Employee
    await page.getByRole('button', { name: 'Add Employee' }).click();
    await page.getByPlaceholder('e.g. Kashinath Hosapeti').fill('Demo User');
    await page.getByPlaceholder('e.g. EMP-001').fill('DEMO-999');
    await page.getByRole('button', { name: 'Save Changes' }).click();
    await expect(page.getByText('Demo User')).toBeVisible();
    await page.waitForTimeout(1000);

    // 5. Machines View
    await page.getByRole('link', { name: 'Machines' }).click();
    await expect(page).toHaveURL(/.*\/machines/);
    await page.waitForTimeout(1000);

    // 6. Storage View
    await page.getByRole('link', { name: 'Storage' }).click();
    await expect(page).toHaveURL(/.*\/storage/);
    await page.waitForTimeout(1000);

    // 7. Back Home
    await page.getByRole('link', { name: 'QR Layout' }).click();
    await page.waitForTimeout(1000);
});
