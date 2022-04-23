import * as Cfx from 'fivem-js';
import { Vector3 } from 'fivem-js';

const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));

RegisterCommand(
  'clear',
  async (source, args) => {
    RemoveAllPedWeapons(GetPlayerPed(-1),true);
    emit('chat:addMessage', {
      args: [
        "Deleted all weapons!"
      ]
    });
  },
  false,
);

RegisterCommand(
  'getcoords',
  async (source, args) => {
    var position = Cfx.Game.PlayerPed.Position;
    emit('chat:addMessage', {
      args: [
        "x: "+position.x+" y: "+position.y+" z: "+position.z
      ]
    });
  },
  false,
);

var enemyPed = {name:'enemies', model:'g_m_m_chicold_01', weapon:"WEAPON_PISTOL"};
var weapons = ["WEAPON_PISTOL","WEAPON_PUMPSHOTGUN","WEAPON_SMG", 
"WEAPON_ASSAULTSMG", "WEAPON_ASSAULTRIFLE", "WEAPON_CARBINERIFLE", 
"WEAPON_ADVANCEDRIFLE","WEAPON_MOLOTOV"];
RegisterCommand(
'spawn',
async(source, args) => {
  var position = {x:2814, y:-673, z:2};
  SetPedCoordsKeepVehicle(GetPlayerPed(-1), position.x, position.y, position.z);
  //Countdown
  emit('chat:addMessage', {
    args: [
      "Gunmode starting soon..."
    ]
  });
  let count: number = 3;
  while(count != 0){
    emit('chat:addMessage', {
      args: [
        count--
      ]
    });
    await Delay(1000);
  }

  SetPedCanSwitchWeapon(GetPlayerPed(-1),false);
  GiveWeaponToPed(GetPlayerPed(-1), GetHashKey(enemyPed.weapon),5000, true, true);
  let kills: number = 0;
  let pedDied = false;
  while(kills < 20 && pedDied == false){
    if(kills % 2 == 0){
      let randomWeap = weapons[Math.floor(Math.random() * weapons.length)];
      emit('chat:addMessage', {
        args: [
          "Weapon acquired: "+randomWeap+"!"
        ]
      });
      GiveWeaponToPed(GetPlayerPed(-1), GetHashKey(randomWeap),5000, true, true);
    }
    const playerCoords = Cfx.Game.PlayerPed.Position;
    const ped = GetHashKey(enemyPed.model);
    RequestModel(ped);

    var radius = 15;
    var x = GetRandomFloatInRange(-radius, radius);
    var y = GetRandomFloatInRange(-radius, radius);


    const newPed = CreatePed(4, ped, position.x+x, position.y+y, position.z, 0.0, false, true);
    GiveWeaponToPed(newPed, GetHashKey(enemyPed.weapon),5000, true, true);
    SetPedCombatAttributes(newPed,0,true);
    SetPedCombatAttributes(newPed,5,true);
    SetPedCombatAttributes(newPed,46,true);
    SetPedFleeAttributes(newPed,0,true);
    SetPedRelationshipGroupHash(newPed,GetHashKey(enemyPed.name));
    SetRelationshipBetweenGroups(255, GetHashKey('PLAYER'), GetHashKey(enemyPed.name));
    TaskCombatPed(newPed, GetPlayerPed(-1), 0, 16);

    while(IsPedDeadOrDying(newPed,true) == 0){
      await Delay(1000);
      if(IsPedDeadOrDying(GetPlayerPed(-1),true)==1 && pedDied == false){
        emit('chat:addMessage', {
          args: [
            "You have died."
          ]
        });
        pedDied = true;
        SetEntityHealth(newPed, 0.0);
      }
    }
    kills++;
    if(kills % 3 == 0) //Give some health to player every 2 kills
    {
      SetEntityHealth(GetPlayerPed(-1),GetEntityHealth(GetPlayerPed(-1))+40);
      emit('chat:addMessage', {
        args: [
          "You got some health back for killing 2 enemies."
        ]
      });
    }
    emit('chat:addMessage', {
      args: [
        "You got a kill by killing "+newPed+". Total kills: "+kills
      ]
    });
  }
  RemoveAllPedWeapons(GetPlayerPed(-1),true);
  emit('chat:addMessage', {
    args: [
      "Mission Accomplished."
    ]
  });
},
false,
);
