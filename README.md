## GunGame but PvE twist?

I have decided to build GunGame mode but PvE against NPCs. In this gamemode, you spawn in the area with no weapon but a random one assigned to you by the game, and you get a random weapon every 2 kills, and a little bit of healing every 3 kills. The NPCs spawn in the radius of the spawn location randomly.
## Checks

I have implemented the check for if player dies during this gamemode. In that case, whichever npc killed the player is killed and the loop for the gamemode is terminated. 

## TODOs 
I have left the project at this, but if more had to be added:
1. Add check for if the player leaves the gamemode location for too long.
2. Better notification system
3. Different difficulties
4. Check for ground Z-level so that npcs dont drop down after spawning
5. Get a list of which guns the player had before and give them back to them after the gamemode? 
