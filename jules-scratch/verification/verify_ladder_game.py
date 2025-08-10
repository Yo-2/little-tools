from playwright.sync_api import sync_playwright, Page, expect

def verify_ladder_game_features(page: Page):
    """
    This script verifies the new features implemented in the Ladder Game.
    1. Checks if player/prize names render correctly (the previous bug).
    2. Clicks "Start All" to render paths.
    3. Hovers over a prize to check the highlight effect.
    4. Takes a screenshot of the final state.
    """
    # Navigate to the page
    page.goto("http://localhost:5173/ladderGame")

    # **Verification 1: Check if inputs have values**
    # This was the main symptom of the reactivity bug.
    expect(page.locator('input[value="Player 1"]')).to_be_visible()
    expect(page.locator('input[value="Prize A"]')).to_be_visible()
    print("Initial state (player and prize names) rendered correctly.")

    # **Verification 2: Set speed and start animation**
    page.locator("#animation-speed").fill("0.5")
    page.get_by_role("button", name="Start All").click()

    # Wait for paths to be visible
    expect(page.locator('path').first).to_be_visible()
    print("Paths rendered correctly after starting animation.")

    # Wait for animation to finish
    page.wait_for_timeout(700)

    # **Verification 3: Prize hover effect**
    # Hover over the second prize
    page.locator(".result-input").nth(1).hover()
    page.wait_for_timeout(200) # Give it a moment to render the hover effect
    print("Prize hover effect triggered.")

    # Final screenshot
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
