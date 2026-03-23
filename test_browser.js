const { chromium } = require('playwright');
const fs = require('fs');

async function testCoralGuard() {
  console.log('🧪 Testing CoralGuard UI - Verifying No Mock Data');
  console.log('================================================\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  const page = await context.newPage();
  
  const results = [];
  
  try {
    // Test 1: Load homepage
    console.log('Test 1: Loading homepage...');
    await page.goto('https://tiny-fish-project.vercel.app', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const heroText = await page.textContent('body');
    
    // Check for removed mock stats
    const hasMockSensors = heroText.includes('2,847') || heroText.includes('2847');
    const hasMockReefs = heroText.includes('156');
    const hasMockGuardians = heroText.includes('12,500') || heroText.includes('12500');
    
    results.push({
      test: 'No Hardcoded Stats in Hero',
      passed: !hasMockSensors && !hasMockReefs && !hasMockGuardians,
      details: `Sensors: ${hasMockSensors}, Reefs: ${hasMockReefs}, Guardians: ${hasMockGuardians}`
    });
    
    console.log(`  ✅ No mock sensor count: ${!hasMockSensors}`);
    console.log(`  ✅ No mock reef count: ${!hasMockReefs}`);
    console.log(`  ✅ No mock guardian count: ${!hasMockGuardians}`);
    
    // Check for blockchain connected indicator
    const hasBlockchainIndicator = heroText.includes('Blockchain') || heroText.includes('Testnet');
    results.push({
      test: 'Blockchain Connection Indicator',
      passed: hasBlockchainIndicator,
      details: 'Shows blockchain status instead of fake stats'
    });
    console.log(`  ✅ Blockchain indicator present: ${hasBlockchainIndicator}`);
    
    // Screenshot for verification
    await page.screenshot({ path: '/tmp/coralguard_home.png' });
    console.log('  📸 Screenshot saved: /tmp/coralguard_home.png\n');
    
    // Test 2: Scroll to Dashboard section
    console.log('Test 2: Checking Reef Dashboard...');
    await page.click('text=Explore Reefs');
    await page.waitForTimeout(2000);
    
    const dashboardText = await page.textContent('#dashboard');
    const hasMockReefData = dashboardText.includes('GBR-001') || dashboardText.includes('MAL-001');
    const hasConnectPrompt = dashboardText.includes('connect') || dashboardText.includes('Connect');
    const hasEmptyState = dashboardText.includes('No Reef Data') || dashboardText.includes('not yet deployed');
    
    results.push({
      test: 'No Mock Reef Data',
      passed: !hasMockReefData,
      details: 'Mock reefs like GBR-001 removed'
    });
    
    results.push({
      test: 'Proper Empty State',
      passed: hasEmptyState || hasConnectPrompt,
      details: 'Shows appropriate message when no data'
    });
    
    console.log(`  ✅ No mock reef data (GBR-001, etc): ${!hasMockReefData}`);
    console.log(`  ✅ Empty state shown: ${hasEmptyState || hasConnectPrompt}`);
    
    await page.screenshot({ path: '/tmp/coralguard_dashboard.png' });
    console.log('  📸 Screenshot saved: /tmp/coralguard_dashboard.png\n');
    
    // Test 3: Check NFT section
    console.log('Test 3: Checking NFT Minting section...');
    await page.goto('https://tiny-fish-project.vercel.app#nft');
    await page.waitForTimeout(2000);
    
    const nftText = await page.textContent('#nft');
    const hasMintedCounts = nftText.match(/\d{1,3},?\d{3}\s*\/\s*\d{1,3},?\d{3}/);
    const hasHardcodedStats = nftText.includes('142.5 ETH') || nftText.includes('356,000');
    
    results.push({
      test: 'No Hardcoded NFT Stats',
      passed: !hasHardcodedStats,
      details: 'Removed hardcoded 142.5 ETH, $356,000 stats'
    });
    
    console.log(`  ✅ No hardcoded donation stats: ${!hasHardcodedStats}`);
    
    await page.screenshot({ path: '/tmp/coralguard_nft.png' });
    console.log('  📸 Screenshot saved: /tmp/coralguard_nft.png\n');
    
    // Test 4: Check Impact section
    console.log('Test 4: Checking Impact Stats...');
    await page.goto('https://tiny-fish-project.vercel.app#impact');
    await page.waitForTimeout(2000);
    
    const impactText = await page.textContent('#impact');
    const hasComingSoon = impactText.includes('Coming Soon') || impactText.includes('—');
    const hasOldStats = impactText.includes('2,847') || impactText.includes('12,500') || impactText.includes('156');
    
    results.push({
      test: 'Impact Stats Show Placeholders',
      passed: hasComingSoon && !hasOldStats,
      details: 'Old hardcoded stats removed, showing placeholders'
    });
    
    console.log(`  ✅ Placeholders instead of fake stats: ${hasComingSoon && !hasOldStats}`);
    
    await page.screenshot({ path: '/tmp/coralguard_impact.png' });
    console.log('  📸 Screenshot saved: /tmp/coralguard_impact.png\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    results.push({
      test: 'Browser Automation',
      passed: false,
      details: error.message
    });
  } finally {
    await browser.close();
  }
  
  // Print Summary
  console.log('\n================================================');
  console.log('📊 TEST SUMMARY');
  console.log('================================================');
  
  let passed = 0;
  let failed = 0;
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.test}`);
    console.log(`   ${result.details}`);
    if (result.passed) passed++;
    else failed++;
  });
  
  console.log('\n-----------------------------------------------');
  console.log(`Total: ${results.length} tests | ✅ ${passed} passed | ❌ ${failed} failed`);
  
  const allPassed = failed === 0;
  console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED - Mock data successfully removed!' : '⚠️ Some tests failed'}`);
  
  return { results, allPassed };
}

testCoralGuard().then(result => {
  process.exit(result.allPassed ? 0 : 1);
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
