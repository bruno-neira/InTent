import puppeteer, { Browser, Page } from 'puppeteer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

describe('InTent Extension E2E Tests', () => {
  let browser: Browser
  let page: Page
  const extensionPath = path.join(__dirname, '../../dist')

  beforeAll(async () => {
    // Launch browser with extension loaded
    browser = await puppeteer.launch({
      headless: false, // Set to true for CI
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    })
  })

  afterAll(async () => {
    if (browser) {
      await browser.close()
    }
  })

  beforeEach(async () => {
    page = await browser.newPage()
  })

  afterEach(async () => {
    if (page) {
      await page.close()
    }
  })

  it('should load extension successfully', async () => {
    await page.goto('chrome://extensions/')
    
    // Wait for extensions page to load
    await page.waitForSelector('[role="main"]')
    
    // Check if our extension is loaded
    const extensionElements = await page.$$eval('extensions-item', (items) => {
      return items.map((item: any) => item.shadowRoot?.textContent || '')
    })
    
    const isExtensionLoaded = extensionElements.some(text => 
      text.includes('Intentional LinkedIn') || text.includes('intent')
    )
    
    expect(isExtensionLoaded).toBe(true)
  })

  it('should inject chat interface on LinkedIn', async () => {
    // Navigate to LinkedIn (you might want to use a test page instead)
    await page.goto('https://www.linkedin.com/feed/')
    
    // Wait for page to load
    await page.waitForTimeout(2000)
    
    // Check if chat interface is injected
    const chatInterface = await page.$('#intentional-linkedin-chat')
    expect(chatInterface).toBeTruthy()
  })

  it('should hide LinkedIn feed elements', async () => {
    await page.goto('https://www.linkedin.com/feed/')
    await page.waitForTimeout(2000)
    
    // Check if feed elements are hidden
    const feedElements = await page.$$('[data-id="feed-tab-icon"]')
    
    if (feedElements.length > 0) {
      const isHidden = await page.evaluate((element) => {
        const style = window.getComputedStyle(element)
        return style.display === 'none' || style.visibility === 'hidden'
      }, feedElements[0])
      
      expect(isHidden).toBe(true)
    }
  })

  it('should respond to keyboard shortcuts', async () => {
    await page.goto('https://www.linkedin.com/feed/')
    await page.waitForTimeout(2000)
    
    // Get initial state of chat interface
    const initialDisplay = await page.evaluate(() => {
      const chat = document.querySelector('#intentional-linkedin-chat') as HTMLElement
      return chat ? chat.style.display : null
    })
    
    // Press Ctrl+Shift+L (or Cmd+Shift+L on Mac)
    await page.keyboard.down('ControlLeft')
    await page.keyboard.down('ShiftLeft')
    await page.keyboard.press('KeyL')
    await page.keyboard.up('ShiftLeft')
    await page.keyboard.up('ControlLeft')
    
    await page.waitForTimeout(500)
    
    // Check if display state changed
    const newDisplay = await page.evaluate(() => {
      const chat = document.querySelector('#intentional-linkedin-chat') as HTMLElement
      return chat ? chat.style.display : null
    })
    
    expect(newDisplay).not.toBe(initialDisplay)
  })

  it('should open extension popup', async () => {
    // Get extension ID
    const targets = await browser.targets()
    const extensionTarget = targets.find(
      (target) => target.type() === 'background_page' && target.url().includes('chrome-extension://')
    )
    
    if (extensionTarget) {
      const extensionId = extensionTarget.url().split('/')[2]
      
      // Navigate to extension popup
      await page.goto(`chrome-extension://${extensionId}/popup/popup.html`)
      
      // Check if popup loads
      await page.waitForSelector('body')
      const title = await page.title()
      expect(title).toBeTruthy()
    }
  })
})
