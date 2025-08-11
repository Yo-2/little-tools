import re
from playwright.sync_api import Page, expect, sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:5173/ladderGame")

    # 1. Open the sidebar
    page.get_by_role("button", name="Settings").click()

    # Wait for sidebar to be visible
    sidebar = page.locator(".sidebar-content")
    expect(sidebar).to_be_visible()

    # 2. Change settings in the sidebar
    # Change players
    sidebar.get_by_label("Players (one per line)").fill("Luke\nLeia\nHan")

    # Change rung color
    sidebar.get_by_label("Rung Color").fill("#FFD700") # Gold

    # Enable obfuscation
    sidebar.get_by_label("隱藏終點").check()

    # 3. Close the sidebar
    sidebar.get_by_role("button", name="×").click()
    expect(sidebar).not_to_be_visible()

    # 4. Verify changes took effect
    expect(page.get_by_text("Luke")).to_be_visible()
    expect(page.get_by_text("Han")).to_be_visible()

    # Check that results are obfuscated
    expect(page.get_by_text("???")).to_have_count(3)

    # 5. Run a single path
    page.get_by_text("Luke").click()

    # Give it time to animate
    page.wait_for_timeout(2500)

    # 6. Take the final screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
