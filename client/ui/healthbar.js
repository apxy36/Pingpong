// Set total and current health
const totalHealth = 100;
// let currentHealth = 100;

// TailwindCSS width classes map
const widthClasses = [
  'w-0', 'w-1/12', 'w-2/12', 'w-3/12', 'w-4/12', 'w-5/12', 'w-6/12',
  'w-7/12', 'w-8/12', 'w-9/12', 'w-10/12', 'w-11/12', 'w-full'
];

// Function to update health bar
function updateTeamHealth(frameDocument, currentHealth, team, newHealth) {
  // Get health bar element
  try{
    newHealth = min(100, newHealth)
    currentHealth = min(100, currentHealth)
  let healthBar = frameDocument.getElementById('healthbar');
  let tempChangeBar = frameDocument.getElementById('temp-change-bar');
  // currentHealth -= 1;
  // // console.log('heathbar', frameDocument)
  // Calculate health percentage and corresponding TailwindCSS width class
  const healthPercentage = ((currentHealth - 1) / totalHealth) * 100;
  const widthClassIndex = Math.floor(healthPercentage / (100 / widthClasses.length));
  const widthClass = widthClasses[widthClassIndex];

  // Calculate intermediate color
  const red = Math.min(255, 255 - (healthPercentage * 2.55));
  const green = Math.min(255, healthPercentage * 2.55);
  const colorStart = `rgb(${red}, ${green}, 0)`;
  const colorEnd = `rgb(${255 - red}, ${0 + green}, 0)`;
  let gradient;
  if (team == 0){
    gradient = `linear-gradient(to right, ${colorStart}, ${colorEnd})`;
  } else {
    gradient = `linear-gradient(to left, ${colorStart}, ${colorEnd})`;
  }

  // Determine if health increased or decreased
  const healthDiff = newHealth - currentHealth;
  // // console.log('healthDiff', healthDiff)

  // Apply temporary change bar
  if (abs(healthDiff) > 0) {
    tempChangeBar.style.width = `${Math.abs(healthDiff / totalHealth) * 100}%`;
    if (tempChangeBar.classList.contains('bg-slate-400')) {
      tempChangeBar.classList.remove('bg-slate-400');
    } 
    if (tempChangeBar.classList.contains('bg-lime-500')) {
      tempChangeBar.classList.remove('bg-lime-500');
    }

    tempChangeBar.classList.add(healthDiff > 0 ? 'bg-lime-500' : 'bg-slate-400');
    if (team == 0){
      if (healthDiff > 0) {
        tempChangeBar.dir = 'rtl';
      } else {
        tempChangeBar.dir = 'ltr';
      }
    } else {
      if (healthDiff > 0) {
        tempChangeBar.dir = 'ltr';
      } else {
        tempChangeBar.dir = 'rtl';
      }
    }
    
    // tempChangeBar.style.background = healthDiff > 0 ? 'limegreen' : 'palegray';
    tempChangeBar.style.right = healthDiff > 0 ? '0' : 'auto';
    tempChangeBar.style.left = healthDiff > 0 ? 'auto' : '0';
    // console.log('tempChangeBar', tempChangeBar.style.width)


    setTimeout(() => {
    tempChangeBar.style.width = '0';
    currentHealth = newHealth; // Update current health after transition
  }, 2000);
  }
  

  // Remove existing width classes
  // // console.log(healthBar)
  widthClasses.forEach(cls => healthBar.classList.remove(cls));

  // Apply new width class and gradient background
  healthBar.classList.add(widthClass);
  healthBar.style.background = gradient;

  // Update ARIA attribute
  healthBar.parentElement.setAttribute('aria-valuenow', healthPercentage);

  
  } catch (e) {
    // console.log(e)
  }
}


// Example of dynamic update (use your own logic here)
