from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Navigate to the local server
    page.goto("http://localhost:8080")

    # Wait for the page to be fully loaded, specifically for the tool grid to be populated
    page.wait_for_selector('.tool-card', timeout=10000)

    # Take a screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
