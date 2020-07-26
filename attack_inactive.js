// ==UserScript==
// @name         Attack inactive
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://es63.guerrastribales.es/game.php?village=4461&screen=place
// @match        https://es63.guerrastribales.es/game.php?screen=place&village=4461
// @grant        none
// ==/UserScript==




(function() {
    'use strict';

    const getData = () => {
    return JSON.parse(
        localStorage.getItem('_data')
    )
}

const setData = (data) => {
    console.log('setData', data)
    localStorage.setItem('_data', JSON.stringify(data))
}

const createVillage = (coords) => {
    return {
        coords,
        points: 65,
        wall: 0,
        cavalry: 18,
        lastAttack: null,
        every: 90
    }
}

const removeVillage = (coords) => {
    const newData = getData();
    delete newData[coords]

    setData(newData)
}

const addVillages = (villages) => {
    for (let i = 0; i<villages.length; i++) {
        addVillage(createVillage(villages[i]));
    }
}

const addVillage = (village) => {
    const data = {
        ...getData(),
        [village.coords]: village
    }

    setData(data)
}

const twscript = window.twscript = {
    getData,
    setData,
    createVillage,
    addVillage,
    addVillages,
    removeVillage
}

console.log('twscript', twscript)

    const demoData = {
        "526|560": {
            coords: '526|560',
            points: 98,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 45
        },
        "529|561": {
            coords: '529|561',
            points: 198,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 45
        },
        "522|563": {
            coords: '522|563',
            points: 73,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 45
        },
        "523|569": {
            coords: '523|569',
            points: 77,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 45
        },
        "520|554": {
            coords: '520|554',
            points: 100,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 60
        },
        "519|561": {
            coords: '519|561',
            points: 108,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 60
        },
        "516|567": {
            coords: '516|567',
            points: 108,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 60
        },
        "532|557": {
            coords: '532|557',
            points: 108,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 90
        },
        "537|556": {
            coords: '537|556',
            points: 108,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 90
        },
        "539|560": {
            coords: '539|560',
            points: 108,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 90
        },
        "522|566": {
            coords: '522|566',
            points: 65,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 90
        },
        "517|565": {
            coords: '517|565',
            points: 133,
            wall: 0,
            cavalry: 18,
            lastAttack: null,
            every: 90
        },
    }

    const input = document.querySelector("div#place_target > input[type=text]")
    const attackButton = document.querySelector("input#target_attack");
    const cavalryInput = document.querySelector("input#unit_input_light");
    const ramInput = document.querySelector("input#unit_input_ram");
    const axeInput = document.querySelector("input#unit_input_axe");
    const cavalryCount = document.querySelector("input#unit_input_light").dataset.allCount
    const ramCount = document.querySelector("input#unit_input_ram").dataset.allCount
    const axeCount = document.querySelector("input#unit_input_axe").dataset.allCount

    const shouldSendAttack = (village) => {
        const now = new Date();
        const { lastAttack, every, cavalry } = village
        const AVAILABLE_UNITS = parseInt(
            document.querySelector("a#units_entry_all_light").innerText.replace(/[()]/g,""),
            10
        );

        console.log('shouldSen', cavalry, AVAILABLE_UNITS);

        if (cavalry > AVAILABLE_UNITS) return false

        if (!lastAttack) return true

        console.log('shouldSendAttack.date');

        return lastAttack + (every * 60 * 1000) < now.getTime()
    }
    const shouldSendRamAttack = (village) => {
        const now = new Date();
        const {lastRamAttack} = village
        const availableUnits = {
            ram: parseInt(
                document.querySelector("a#units_entry_all_ram").innerText.replace(/[()]/g,""),
                10
            ),
            axe: parseInt(
                document.querySelector("a#units_entry_all_axe").innerText.replace(/[()]/g,""),
                10
            )
        }

        if (availableUnits.ram < 4 || availableUnits.axe < 16) {
            return false
        }

        if (!lastRamAttack) {
            return true
        }
        // Once a day
        return lastRamAttack + (3600 * 24 * 1000) < now.getTime()
    }

    const prepareAttack = (village) => {
        return {
            ...village,
            lastAttack: new Date().getTime()
        }
    }
    const prepareRamAttack = (village) => {
        return {
            ...village,
            lastRamAttack: new Date().getTime()
        }
    }

    const attack = async (village) => {
        console.log('village', village)
        return new Promise((resolve, reject) => {
            input.value = village.coords
            cavalryInput.value = village.cavalry


            setTimeout(() => {
                const evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                // If cancelled, don't dispatch our event
                console.log("button", attackButton)
                const canceled = !attackButton.dispatchEvent(evt);
                resolve(canceled)
            }, 3000)
        })
    }
    const attackRam = (village) => {
        console.log('village', village)
        return new Promise((resolve, reject) => {
            input.value = village.coords
            axeInput.value = 16
            ramInput.value = 4

            setTimeout(() => {
                const evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                // If cancelled, don't dispatch our event
                console.log("button", attackButton)
                const canceled = !attackButton.dispatchEvent(evt);
                resolve(canceled)
            }, 3000)
        })
    }

    const run = async () => {
        const data = twscript.getData();
        const villages = Object.values(data);

        const attackableVillages = villages
        .filter(shouldSendAttack)
        .sort((a, b) => {
            if (!!a.lastAttack) return 1;
            if (!!b.lastAttack) return -1;
            return a.lastAttack < b.lastAttack
        })
        ;

        console.log('attackableVillages', attackableVillages)

        if (attackableVillages.length) {
            const selectedVillage = attackableVillages[0];
            const newVillageData = prepareAttack(selectedVillage)

            setData({
                ...getData(),
                [selectedVillage.coords]: newVillageData
            })

            console.log('newData', data, selectedVillage, new Date(selectedVillage.lastAttack * 1000))

            attack(selectedVillage)
        } else {

            let ramAttackableVillages = villages
            .filter(shouldSendRamAttack)
            .sort((a, b) => {
                if (!!a.lastRamAttack) return 1;
                if (!!b.lastRamAttack) return -1;
                return a.lastRamAttack < b.lastRamAttack
            })

            console.log('ramAttackableVillages', ramAttackableVillages)

            if (ramAttackableVillages.length) {
                const selectedVillage = ramAttackableVillages[0];
                const newRamVillageData = prepareRamAttack(selectedVillage)

                setData({
                    ...getData(),
                    [selectedVillage.coords]: newRamVillageData
                })

                console.log('newData', data, selectedVillage, new Date(selectedVillage.lastAttack * 1000))

                attackRam(selectedVillage)
            }

            setTimeout(run, 20 * 1000)
        }
    }

    run();
})();
