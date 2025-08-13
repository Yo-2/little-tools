import re
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/")

    # Give the page time to load
    page.wait_for_load_state('networkidle')

    # Interact with Font Family MultiSelect
    font_family_input = page.get_by_placeholder("Search Google Fonts...")

    # Add "Roboto"
    font_family_input.fill("Roboto")
    page.keyboard.press("Enter")

    # Add "Open Sans"
    font_family_input.fill("Open Sans")
    page.keyboard.press("Enter")

    # Add "Lato"
    font_family_input.fill("Lato")
    page.keyboard.press("Enter")

    # Interact with Weather Location ComboBox
    # Click on the "Weather" tab
    page.get_by_role("button", name="Weather").first.click()

    weather_location_input = page.get_by_placeholder("Select or type a city...")
    weather_location_input.fill("Taipei")

    # Take screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
