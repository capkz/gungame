import * as Cfx from 'fivem-js';
import { Vector3 } from 'fivem-js';

const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));

RegisterCommand( //This command was used foor clearing out all the guns from the pocket to help me test out features
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

RegisterCommand( //This command was used to get coordinates of certain spots in order to be used as spawn coords.
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

var enemyPed = {name:'enemies', model:'g_m_m_chicold_01', weapon:"WEAPON_PISTOL"}; //all the info about enemy peds,,
var weapons = ["WEAPON_PISTOL","WEAPON_PUMPSHOTGUN","WEAPON_SMG", 
"WEAPON_ASSAULTSMG", "WEAPON_ASSAULTRIFLE", "WEAPON_CARBINERIFLE", 
"WEAPON_ADVANCEDRIFLE","WEAPON_MOLOTOV"]; //some random weapons that will be randomly selected every x kills
RegisterCommand(
'spawn',
async(source, args) => {
  var position = {x:2814, y:-673, z:2};
  SetPedCoordsKeepVehicle(GetPlayerPed(-1), position.x, position.y, position.z); //teleport the ped to the area
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

  SetPedCanSwitchWeapon(GetPlayerPed(-1),false); //ped can't switch weapons during the gamemode
  GiveWeaponToPed(GetPlayerPed(-1), GetHashKey(enemyPed.weapon),5000, true, true); //force equip a random weapon from the list
  let kills: number = 0;
  let pedDied = false;
  while(kills < 20 && pedDied == false){ //keep the loop going unless 20 kills have been reached or the player has died
    if(kills % 2 == 0){ //every 2 kills, random weapon
      let randomWeap = weapons[Math.floor(Math.random() * weapons.length)];
      emit('chat:addMessage', {
        args: [
          "Weapon acquired: "+randomWeap+"!"
        ]
      });
      GiveWeaponToPed(GetPlayerPed(-1), GetHashKey(randomWeap),5000, true, true); //give the weapon to the player and force attach it
    }
    const playerCoords = Cfx.Game.PlayerPed.Position;
    const ped = GetHashKey(enemyPed.model);
    RequestModel(ped); //load the model to the memory

    var radius = 15; //radius for npc spawn
    var x = GetRandomFloatInRange(-radius, radius);
    var y = GetRandomFloatInRange(-radius, radius);


    const newPed = CreatePed(4, ped, position.x+x, position.y+y, position.z, 0.0, false, true); //spawning in the peds
    GiveWeaponToPed(newPed, GetHashKey(enemyPed.weapon),5000, true, true); //forcing the peds to hold and attack with the gun
    SetPedCombatAttributes(newPed,0,true); //peds can take cover
    SetPedCombatAttributes(newPed,5,true); //peds can fight unarmed
    SetPedCombatAttributes(newPed,46,true); //peds always fight
    SetPedFleeAttributes(newPed,0,true); // no flee
    SetPedRelationshipGroupHash(newPed,GetHashKey(enemyPed.name)); //assign the ped to a team
    SetRelationshipBetweenGroups(255, GetHashKey('PLAYER'), GetHashKey(enemyPed.name)); //make the ped's team hate the player
    TaskCombatPed(newPed, GetPlayerPed(-1), 0, 16); //straight up make the ped fucking attack the player

    while(IsPedDeadOrDying(newPed,true) == 0){ //check if the spawned ped is dead or not
      await Delay(1000); 
      if(IsPedDeadOrDying(GetPlayerPed(-1),true)==1 && pedDied == false){
        emit('chat:addMessage', {
          args: [
            "You have died."
          ]
        });
        pedDied = true; //stop the loop
        SetEntityHealth(newPed, 0.0); //kill the ped if player is dead too
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
  SetPedCanSwitchWeapon(GetPlayerPed(-1),true;
  emit('chat:addMessage', {
    args: [
      "Mission Accomplished."
    ]
  });
},
false,
);
