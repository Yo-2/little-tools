import time
from playwright.sync_api import sync_playwright, Page, expect

def verify_ladder_game_features(page: Page):
    """
    This script verifies the new features implemented in the Ladder Game.
    """
    # 1. Navigate to the Ladder Game page.
    page.goto("http://localhost:5173/ladderGame")

    # Wait for the ladder to be generated.
    expect(page.get_by_role("button", name="New Ladder")).to_be_visible()

    # 2. Change animation speed to 0.5s for quick testing.
    speed_input = page.locator("#animation-speed")
    expect(speed_input).to_be_visible()
    speed_input.fill("0.5")

    # 3. Click "Start All" to reveal paths.
    page.get_by_role("button", name="Start All").click()

    # 4. Wait for the paths to appear and animation to start.
    try:
        expect(page.locator('path').first).to_be_visible(timeout=5000)
    except Exception as e:
        print("Path locator not found. Dumping page content.")
        print(page.content())
        raise e

    # 5. Wait for the animation to complete.
    page.wait_for_timeout(700) # 0.5s animation + buffer

    # 6. Hover over the second prize to trigger the hover effect.
    prize_inputs = page.locator(".result-input")
    prize_inputs.nth(1).hover()

    page.wait_for_timeout(200) # wait for hover effect to render

    # 7. Take a screenshot to verify the changes.
    screenshot_path = "jules-scratch/verification/verification.png"
    page.screenshot(path=screenshot_path)
    print(f"Screenshot saved to {screenshot_path}")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_ladder_game_features(page)
        finally:
            browser.close()

if __name__ == "__main__":
    main()
