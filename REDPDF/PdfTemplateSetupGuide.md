# PDF Template Setup Guide

This guide explains how to set up your PDF template for use with the REDPDF application. The template needs to have form fields with specific names that match the fields in the web application.

## Required PDF Template

Your PDF template must be named `template.pdf` and placed in the root directory of the project. The template should have form fields with the following names to match the web application fields.

## Field Names Mapping

### Character Information Fields

#### Basic Info
- `charName` - Character name
- `charRole` - Character role
- `charRank` - Character rank
- `charNotes` - Character notes
- `charHealth` - Character health

#### Characteristics (with multiple values)
- `intellect` - Intellect (first value)
- `intellect2` - Intellect (second value)
- `intellect3` - Intellect (third value)
- `reaction` - Reaction (first value)
- `reaction2` - Reaction (second value)
- `reaction3` - Reaction (third value)
- `reflexes` - Reflexes (first value)
- `reflexes2` - Reflexes (second value)
- `reflexes3` - Reflexes (third value)
- `tech` - Technique (first value)
- `tech2` - Technique (second value)
- `tech3` - Technique (third value)
- `charisma` - Charisma (first value)
- `charisma2` - Charisma (second value)
- `charisma3` - Charisma (third value)
- `will` - Will (first value)
- `will2` - Will (second value)
- `will3` - Will (third value)
- `luck` - Luck
- `speed` - Speed
- `body` - Body

#### Skills
- `concentration` - Concentration
- `hideObject` - Hide/Reveal Object
- `lipReading` - Lip Reading
- `attention` - Attentiveness
- `tracking` - Tracking
- `athletics` - Athletics
- `acrobatics` - Acrobatics
- `dance` - Dance
- `endurance` - Endurance
- `resistance` - Torture/Drug Resistance
- `stealth` - Stealth
- `driving` - Driving
- `piloting` - Piloting
- `navigation` - Navigation
- `riding` - Riding
- `accounting` - Accounting
- `animals` - Animal Handling
- `bureaucracy` - Bureaucracy
- `business` - Business
- `composition` - Composition
- `criminology` - Criminology
- `cryptography` - Cryptography
- `deduction` - Deduction
- `education` - Education
- `gambling` - Gambling
- `slang` - Street Slang
- `language1` - Language 1 value
- `language1Name` - Language 1 name
- `language2` - Language 2 value
- `language2Name` - Language 2 name
- `infoSearch` - Information Search
- `homeArea` - Home Area
- `area1` - Area 1 value
- `area1Name` - Area 1 name
- `area1stat` - Area 1 stat
- `area2` - Area 2 value
- `area2Name` - Area 2 name
- `area2stat` - Area 2 stat
- `tactics` - Tactics
- `desertSurvival` - Desert Survival
- `melee` - Hand-to-Hand Combat
- `dodge` - Dodging
- `martialArts` - Martial Arts
- `meleeWeapons` - Melee Weapons
- `acting` - Acting
- `instrument1` - Instrument 1 value
- `instrument1Name` - Instrument 1 name
- `instrument1stat` - Instrument 1 stat
- `instrument2` - Instrument 2 value
- `instrument2Name` - Instrument 2 name
- `instrument2stat` - Instrument 2 stat
- `archery` - Archery
- `automaticFire` - Automatic Fire
- `pistols` - Pistols
- `heavyWeapons` - Heavy Weapons
- `tacticalWeapons` - Tactical Weapons
- `bribery` - Bribery
- `conversation` - Conversation
- `insight` - Insight
- `interrogation` - Interrogation
- `persuasion` - Persuasion
- `selfCare` - Self-Care
- `streetWise` - Street Wise
- `trading` - Trading
- `wardrobe` - Wardrobe & Style
- `aviationTech` - Aviation Technology
- `techKnowledge` - Tech Knowledge
- `cyberTech` - Cyber Tech
- `demolitions` - Demolitions
- `electronics` - Electronics/Security
- `firstAid` - First Aid
- `falsification` - Falsification
- `automotive` - Automotive Mechanics
- `craft` - Artistic Craft
- `paramedic` - Paramedic
- `photoVideo` - Cinema & Photo Tech
- `locksmith` - Lockpicking
- `pickpocket` - Pickpocket
- `marineTech` - Marine Technology
- `weaponsmith` - Weaponsmith

### Life Path Fields
- `pseudonyms` - Pseudonyms
- `heritage` - Cultural Heritage
- `personality` - Personality
- `style` - Style of Dress
- `valuesMost` - What You Value Most
- `closestPerson` - Closest Person
- `familyHistory` - Family History
- `familyCrisis` - Family Crisis
- `haircut` - Haircut
- `attitudePeople` - Attitude to People
- `valuablePossession` - Most Valuable Possession
- `lifeGoals` - Life Goals
- `friend1`, `friend2`, `friend3` - Friend names
- `tragicLove1`, `tragicLove2`, `tragicLove3` - Tragic love names
- `enemy1`, `enemy2`, `enemy3` - Enemy names
- `enemy1Reason`, `enemy2Reason`, `enemy3Reason` - Reasons for enmity
- `enemy1Action`, `enemy2Action`, `enemy3Action` - What enemies can do
- `enemy1Outcome`, `enemy2Outcome`, `enemy3Outcome` - What should happen
- `equipment1` through `equipment18` - Equipment items
- `equipmentNotes1` through `equipmentNotes18` - Equipment notes
- `imageStyle` - Image and Style
- `housing` - Housing
- `rent` - Rent
- `lifestyle` - Lifestyle
- `roleplayPath` - Roleplay Life Path

### Cybernetics Fields
#### Checkboxes
- `cyberAudio` - Cyber Audio checkbox
- `rightEye` - Right Cybereye checkbox
- `rightArm` - Right Cyberarm checkbox
- `rightLeg` - Right Cyberleg checkbox
- `interface` - Interface checkbox
- `leftEye` - Left Cybereye checkbox
- `leftArm` - Left Cyberarm checkbox
- `leftLeg` - Left Cyberleg checkbox

#### Implants (3 each)
- `audioImplant1` through `audioImplant3` - Audio implant names
- `audioInfo1` through `audioInfo3` - Audio implant info
- `rightEyeImplant1` through `rightEyeImplant3` - Right eye implant names
- `rightEyeInfo1` through `rightEyeInfo3` - Right eye implant info
- `leftEyeImplant1` through `leftEyeImplant3` - Left eye implant names
- `leftEyeInfo1` through `leftEyeInfo3` - Left eye implant info
- `rightArmImplant1` through `rightArmImplant3` - Right arm implant names
- `rightArmInfo1` through `rightArmInfo3` - Right arm implant info
- `leftArmImplant1` through `leftArmImplant3` - Left arm implant names
- `leftArmInfo1` through `leftArmInfo3` - Left arm implant info
- `neuroInterfaceImplant1` through `neuroInterfaceImplant4` - Neurointerface implant names
- `neuroInterfaceInfo1` through `neuroInterfaceInfo4` - Neurointerface implant info
- `rightLegImplant1` through `rightLegImplant3` - Right leg implant names
- `rightLegInfo1` through `rightLegInfo3` - Right leg implant info
- `leftLegImplant1` through `leftLegImplant3` - Left leg implant names
- `leftLegInfo1` through `leftLegInfo3` - Left leg implant info

#### Implants (7 each)
- `internalImplant1` through `internalImplant7` - Internal implant names
- `internalInfo1` through `internalInfo7` - Internal implant info
- `externalImplant1` through `externalImplant7` - External implant names
- `externalInfo1` through `externalInfo7` - External implant info
- `stylishImplant1` through `stylishImplant7` - Stylish implant names
- `stylishInfo1` through `stylishInfo7` - Stylish implant info
- `borg1` through `borg7` - Borg implant names
- `borgInfo1` through `borgInfo7` - Borg implant info

## How to Create the Template

1. Open Adobe Acrobat Pro or another PDF editor that supports form fields
2. Open your character sheet PDF
3. Go to "Tools" → "Prepare Form"
4. Add text fields, checkboxes, and dropdowns where you want the data to appear
5. Name each field according to the mapping above
6. Save the file as `template.pdf` in the root directory of the project

## Important Notes

- Field names must match exactly as listed above
- Text fields will receive text values from the form
- Checkboxes will be checked/unchecked based on boolean values
- The application will flatten the form fields in the final PDF, making them non-editable
- Avoid creating fields with names that include "Summ*" as these will be ignored