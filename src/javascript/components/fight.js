import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        let id1;
        let id2;
        const pressedKeys = {};
        firstFighter.isBlocked = false;
        secondFighter.isBlocked = false;
        const firstFighterHealthBar = document.querySelector('#left-fighter-indicator');
        const secondFighterHealthBar = document.querySelector('#right-fighter-indicator');
        const firstFighterHealthBarWidth = parseInt(getComputedStyle(firstFighterHealthBar).width);
        const secondFighterHealthBarWidth = parseInt(getComputedStyle(secondFighterHealthBar).width);
        const firstFighterInitialHealth = firstFighter.health;
        const secondFighterInitialHealth = secondFighter.health;
        
        document.addEventListener('keydown', function(e){
            pressedKeys[e.code] = true;
            if (e.code == controls.PlayerOneBlock) {
                firstFighter.isBlocked = true;
            }
            if (e.code == controls.PlayerTwoBlock) {
                secondFighter.isBlocked = true;
            }
            
            if (!id1 && pressedKeys[controls.PlayerOneCriticalHitCombination[0]] && pressedKeys[controls.PlayerOneCriticalHitCombination[1]] && pressedKeys[controls.PlayerOneCriticalHitCombination[2]]) {
                secondFighter.health -= 2 * firstFighter.attack;
                id1 = setTimeout(()=>{
                    id1 = null;
                },10000);
                secondFighterHealthBar.style.width = setHealthBarWidth (secondFighter, secondFighterHealthBarWidth, secondFighterInitialHealth);
                setHealthBarColor(secondFighter,secondFighterInitialHealth,secondFighterHealthBar);
                checkEndGame(); 
            }
            
            if (!id2 && pressedKeys[controls.PlayerTwoCriticalHitCombination[0]] && pressedKeys[controls.PlayerTwoCriticalHitCombination[1]] && pressedKeys[controls.PlayerTwoCriticalHitCombination[2]]) {
                firstFighter.health -= 2 * secondFighter.attack;
                id2 = setTimeout(()=>{
                    id2 = null;
                },10000);
                firstFighterHealthBar.style.width = setHealthBarWidth (firstFighter, firstFighterHealthBarWidth, firstFighterInitialHealth);
                setHealthBarColor(firstFighter,firstFighterInitialHealth,firstFighterHealthBar);
                checkEndGame(); 
            }
        })
        
        document.addEventListener('keyup',function(e){
            if (e.code == controls.PlayerOneAttack && !firstFighter.isBlocked && !secondFighter.isBlocked) {
                secondFighter.health -= getHitPower(firstFighter);
                secondFighterHealthBar.style.width = setHealthBarWidth (secondFighter, secondFighterHealthBarWidth, secondFighterInitialHealth);
                setHealthBarColor(secondFighter,secondFighterInitialHealth,secondFighterHealthBar);
                checkEndGame(); 
            } else if (e.code == controls.PlayerOneAttack && !firstFighter.isBlocked && secondFighter.isBlocked) {
                secondFighter.health -= getDamage(firstFighter,secondFighter);
                secondFighterHealthBar.style.width = setHealthBarWidth (secondFighter, secondFighterHealthBarWidth, secondFighterInitialHealth);
                setHealthBarColor(secondFighter,secondFighterInitialHealth,secondFighterHealthBar);
                checkEndGame(); 
            }
        
            if (e.code == controls.PlayerTwoAttack && !secondFighter.isBlocked && !firstFighter.isBlocked) {
                firstFighter.health -= getHitPower(secondFighter);
                firstFighterHealthBar.style.width = setHealthBarWidth (firstFighter, firstFighterHealthBarWidth, firstFighterInitialHealth);
                setHealthBarColor(firstFighter,firstFighterInitialHealth,firstFighterHealthBar);
                checkEndGame(); 
            } else if (e.code == controls.PlayerTwoAttack && !secondFighter.isBlocked && firstFighter.isBlocked) {
                firstFighter.health -= getDamage(secondFighter,firstFighter);
                firstFighterHealthBar.style.width = setHealthBarWidth (firstFighter, firstFighterHealthBarWidth, firstFighterInitialHealth);
                setHealthBarColor(firstFighter,firstFighterInitialHealth,firstFighterHealthBar);
                checkEndGame(); 
            }
        
            if (e.code == controls.PlayerOneBlock) {
                firstFighter.isBlocked = false;
            }
            if (e.code == controls.PlayerTwoBlock) {
                secondFighter.isBlocked = false;
            }
            pressedKeys[e.code] = false;
        });
        
        function setHealthBarWidth (fighter, fighterHealthBarWidth, fighterInitialHealth) {
            return (fighter.health > 0 ? fighter.health*fighterHealthBarWidth/fighterInitialHealth : 0) + 'px'
        };

        function setHealthBarColor (fighter,initialHealth,healthBar) { 
            if (fighter.health / initialHealth < 0.2) {
                healthBar.style.background = 'red';
            }
        }

        function checkEndGame() {
            getFighterName (firstFighter,secondFighter);
            getFighterName (secondFighter,firstFighter);
        }

        function getFighterName (fighter,rival) {
            if (fighter.health <= 0) resolve(rival.name);
        }
    });
}

export function getDamage(attacker, defender) {
    // return damage
    const damage = getHitPower(attacker)-getBlockPower(defender);
    return damage>0 ? damage : 0;
}

export function getHitPower(fighter) {
    // return hit power
    const { attack } = fighter;
    const criticalHitChance = Math.random() + 1;
    return attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    // return block power
    const { defense } = fighter;
    const dodgeChance = Math.random() + 1;
    return defense * dodgeChance;
}