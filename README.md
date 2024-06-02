# Enotes Automation

### Local setup

1. Clone this repo:
   `git clone https://github.com/en-danilovich/enotes-automation.git`
2. Install node.js dependencies:
   `npm install`
3. Install playwright dependencies:
   `npx playwright install`
4. Create .env file in root folder and specify values:
   - `BASE_URL` (format: 'https://domain/) -> https://enotes.pointschool.ru/
   - `API_URL` (format: 'https://domain/) -> https://enotes.pointschool.ru/
   - `USER_NAME`
   - `USER_PASSWORD`

If you wish to run or debug the test from VS Code install the [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) in VS Code.

### Run Tests via terminal

1. 'npx playwright test'

### Generate allure report

1. allure generate --clean
2. allure open
