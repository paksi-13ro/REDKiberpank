// REDPDF - Cyberpunk Character Sheet Application
// Frontend JavaScript Logic

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const loginSection = document.getElementById('loginSection');
    const mainContent = document.getElementById('mainContent');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const avatarInput = document.getElementById('avatar');
    const savePdfBtn = document.getElementById('savePdfBtn');
    const downloadPdfBtn = document.getElementById('downloadPdfBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const pdfList = document.getElementById('pdfList');
    const tabLinks = document.querySelectorAll('.cyber-nav a');
    const createUserBtn = document.getElementById('createUserBtn');
    const usersListContainer = document.getElementById('usersListContainer');
    
    // New elements for user management
    const newUserUsername = document.getElementById('newUserUsername');
    const newUserPassword = document.getElementById('newUserPassword');
    
    // Current character data
    let currentCharacterData = {};
    let currentUser = null;
    
    // Initialize the app
    initializeApp();
    
    function initializeApp() {
        // Load saved characters from localStorage if available
        loadSavedCharacters();
        
        // Load users list
        loadUsersList();
        
        // Setup event listeners
        setupEventListeners();
        
        // Check if user is already logged in
        checkLoginStatus();
    }
    
    function setupEventListeners() {
        // Admin login form
        adminLoginForm.addEventListener('submit', handleAdminLogin);
        
        // Logout button
        logoutBtn.addEventListener('click', handleLogout);
        
        // Save PDF button
        savePdfBtn.addEventListener('click', handleSavePdf);
        
        // Download PDF button
        downloadPdfBtn.addEventListener('click', handleDownloadPdf);
        
        // Create user button
        createUserBtn.addEventListener('click', handleCreateUser);
        
        // Tab navigation
        tabLinks.forEach(link => {
            link.addEventListener('click', switchTab);
        });
        
        // Avatar upload preview
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
    
    function checkLoginStatus() {
        const savedUser = localStorage.getItem('redpdf_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            showMainContent();
        } else {
            showLoginScreen();
        }
    }
    
    function handleAdminLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        // Send login request to backend
        fetch('/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                localStorage.setItem('redpdf_user', JSON.stringify(currentUser));
                showMainContent();
            } else {
                alert('Invalid credentials');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert('An error occurred during login');
        });
    }
    
    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('redpdf_user');
        showLoginScreen();
    }
    
    function showLoginScreen() {
        loginSection.style.display = 'flex';
        mainContent.style.display = 'none';
    }
    
    function showMainContent() {
        loginSection.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Show/hide admin controls based on user role
        if (currentUser.role === 'admin') {
            document.querySelector('.admin-controls').style.display = 'block';
        } else {
            document.querySelector('.admin-controls').style.display = 'none';
        }
    }
    
    function switchTab(e) {
        e.preventDefault();
        
        // Remove active class from all tabs and links
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        tabLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        e.target.classList.add('active');
        
        // Show corresponding tab content
        const tabId = e.target.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
    }
    
    function handleAvatarUpload(e) {
        const file = e.target.files[0];
        if(file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Store base64 representation in our character data
                currentCharacterData.avatar = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
    
    function collectCharacterData() {
        // Collect all form data and store in currentCharacterData object
        currentCharacterData = {
            // Basic info
            charName: document.getElementById('charName')?.value || '',
            charRole: document.getElementById('charRole')?.value || '',
            charRank: document.getElementById('charRank')?.value || '',
            charNotes: document.getElementById('charNotes')?.value || '',
            charHealth: document.getElementById('charHealth')?.value || '',
            
            // Characteristics
            intellect: [
                document.getElementById('intellect')?.value || '',
                document.getElementById('intellect2')?.value || '',
                document.getElementById('intellect3')?.value || ''
            ],
            reaction: [
                document.getElementById('reaction')?.value || '',
                document.getElementById('reaction2')?.value || '',
                document.getElementById('reaction3')?.value || ''
            ],
            reflexes: [
                document.getElementById('reflexes')?.value || '',
                document.getElementById('reflexes2')?.value || '',
                document.getElementById('reflexes3')?.value || ''
            ],
            tech: [
                document.getElementById('tech')?.value || '',
                document.getElementById('tech2')?.value || '',
                document.getElementById('tech3')?.value || ''
            ],
            charisma: [
                document.getElementById('charisma')?.value || '',
                document.getElementById('charisma2')?.value || '',
                document.getElementById('charisma3')?.value || ''
            ],
            will: [
                document.getElementById('will')?.value || '',
                document.getElementById('will2')?.value || '',
                document.getElementById('will3')?.value || ''
            ],
            luck: document.getElementById('luck')?.value || '',
            speed: document.getElementById('speed')?.value || '',
            body: document.getElementById('body')?.value || '',
            
            // Skills - Perception
            concentration: document.getElementById('concentration')?.value || '',
            hideObject: document.getElementById('hideObject')?.value || '',
            lipReading: document.getElementById('lipReading')?.value || '',
            attention: document.getElementById('attention')?.value || '',
            tracking: document.getElementById('tracking')?.value || '',
            
            // Skills - Physical
            athletics: document.getElementById('athletics')?.value || '',
            acrobatics: document.getElementById('acrobatics')?.value || '',
            dance: document.getElementById('dance')?.value || '',
            endurance: document.getElementById('endurance')?.value || '',
            resistance: document.getElementById('resistance')?.value || '',
            stealth: document.getElementById('stealth')?.value || '',
            
            // Skills - Management
            driving: document.getElementById('driving')?.value || '',
            piloting: document.getElementById('piloting')?.value || '',
            navigation: document.getElementById('navigation')?.value || '',
            riding: document.getElementById('riding')?.value || '',
            
            // Skills - Educational
            accounting: document.getElementById('accounting')?.value || '',
            animals: document.getElementById('animals')?.value || '',
            bureaucracy: document.getElementById('bureaucracy')?.value || '',
            business: document.getElementById('business')?.value || '',
            composition: document.getElementById('composition')?.value || '',
            criminology: document.getElementById('criminology')?.value || '',
            cryptography: document.getElementById('cryptography')?.value || '',
            deduction: document.getElementById('deduction')?.value || '',
            education: document.getElementById('education')?.value || '',
            gambling: document.getElementById('gambling')?.value || '',
            
            // Language
            slang: document.getElementById('slang')?.value || '',
            language1: document.getElementById('language1')?.value || '',
            language1Name: document.getElementById('language1Name')?.value || '',
            language2: document.getElementById('language2')?.value || '',
            language2Name: document.getElementById('language2Name')?.value || '',
            
            // Information Search
            infoSearch: document.getElementById('infoSearch')?.value || '',
            
            // Territory Knowledge
            homeArea: document.getElementById('homeArea')?.value || '',
            area1: document.getElementById('area1')?.value || '',
            area1Name: document.getElementById('area1Name')?.value || '',
            area1stat: document.getElementById('area1stat')?.value || '',
            area2: document.getElementById('area2')?.value || '',
            area2Name: document.getElementById('area2Name')?.value || '',
            area2stat: document.getElementById('area2stat')?.value || '',
            
            // Tactics and Desert Survival
            tactics: document.getElementById('tactics')?.value || '',
            desertSurvival: document.getElementById('desertSurvival')?.value || '',
            
            // Melee Combat
            melee: document.getElementById('melee')?.value || '',
            dodge: document.getElementById('dodge')?.value || '',
            martialArts: document.getElementById('martialArts')?.value || '',
            meleeWeapons: document.getElementById('meleeWeapons')?.value || '',
            
            // Performance
            acting: document.getElementById('acting')?.value || '',
            
            // Musical Instruments
            instrument1: document.getElementById('instrument1')?.value || '',
            instrument1Name: document.getElementById('instrument1Name')?.value || '',
            instrument1stat: document.getElementById('instrument1stat')?.value || '',
            instrument2: document.getElementById('instrument2')?.value || '',
            instrument2Name: document.getElementById('instrument2Name')?.value || '',
            instrument2stat: document.getElementById('instrument2stat')?.value || '',
            
            // Ranged Combat
            archery: document.getElementById('archery')?.value || '',
            automaticFire: document.getElementById('automaticFire')?.value || '',
            pistols: document.getElementById('pistols')?.value || '',
            heavyWeapons: document.getElementById('heavyWeapons')?.value || '',
            tacticalWeapons: document.getElementById('tacticalWeapons')?.value || '',
            
            // Social Skills
            bribery: document.getElementById('bribery')?.value || '',
            conversation: document.getElementById('conversation')?.value || '',
            insight: document.getElementById('insight')?.value || '',
            interrogation: document.getElementById('interrogation')?.value || '',
            persuasion: document.getElementById('persuasion')?.value || '',
            selfCare: document.getElementById('selfCare')?.value || '',
            streetWise: document.getElementById('streetWise')?.value || '',
            trading: document.getElementById('trading')?.value || '',
            wardrobe: document.getElementById('wardrobe')?.value || '',
            
            // Technical Skills
            aviationTech: document.getElementById('aviationTech')?.value || '',
            techKnowledge: document.getElementById('techKnowledge')?.value || '',
            cyberTech: document.getElementById('cyberTech')?.value || '',
            demolitions: document.getElementById('demolitions')?.value || '',
            electronics: document.getElementById('electronics')?.value || '',
            firstAid: document.getElementById('firstAid')?.value || '',
            falsification: document.getElementById('falsification')?.value || '',
            automotive: document.getElementById('automotive')?.value || '',
            craft: document.getElementById('craft')?.value || '',
            paramedic: document.getElementById('paramedic')?.value || '',
            photoVideo: document.getElementById('photoVideo')?.value || '',
            locksmith: document.getElementById('locksmith')?.value || '',
            pickpocket: document.getElementById('pickpocket')?.value || '',
            marineTech: document.getElementById('marineTech')?.value || '',
            weaponsmith: document.getElementById('weaponsmith')?.value || '',
            
            // Life Path
            pseudonyms: document.getElementById('pseudonyms')?.value || '',
            heritage: document.getElementById('heritage')?.value || '',
            personality: document.getElementById('personality')?.value || '',
            style: document.getElementById('style')?.value || '',
            valuesMost: document.getElementById('valuesMost')?.value || '',
            closestPerson: document.getElementById('closestPerson')?.value || '',
            familyHistory: document.getElementById('familyHistory')?.value || '',
            familyCrisis: document.getElementById('familyCrisis')?.value || '',
            haircut: document.getElementById('haircut')?.value || '',
            attitudePeople: document.getElementById('attitudePeople')?.value || '',
            valuablePossession: document.getElementById('valuablePossession')?.value || '',
            lifeGoals: document.getElementById('lifeGoals')?.value || '',
            
            // Friends
            friend1: document.getElementById('friend1')?.value || '',
            friend2: document.getElementById('friend2')?.value || '',
            friend3: document.getElementById('friend3')?.value || '',
            
            // Tragic Loves
            tragicLove1: document.getElementById('tragicLove1')?.value || '',
            tragicLove2: document.getElementById('tragicLove2')?.value || '',
            tragicLove3: document.getElementById('tragicLove3')?.value || '',
            
            // Enemies
            enemy1: document.getElementById('enemy1')?.value || '',
            enemy1Reason: document.getElementById('enemy1Reason')?.value || '',
            enemy1Action: document.getElementById('enemy1Action')?.value || '',
            enemy1Outcome: document.getElementById('enemy1Outcome')?.value || '',
            
            enemy2: document.getElementById('enemy2')?.value || '',
            enemy2Reason: document.getElementById('enemy2Reason')?.value || '',
            enemy2Action: document.getElementById('enemy2Action')?.value || '',
            enemy2Outcome: document.getElementById('enemy2Outcome')?.value || '',
            
            enemy3: document.getElementById('enemy3')?.value || '',
            enemy3Reason: document.getElementById('enemy3Reason')?.value || '',
            enemy3Action: document.getElementById('enemy3Action')?.value || '',
            enemy3Outcome: document.getElementById('enemy3Outcome')?.value || '',
            
            // Equipment (18 items)
            equipment1: document.getElementById('equipment1')?.value || '',
            equipmentNotes1: document.getElementById('equipmentNotes1')?.value || '',
            equipment2: document.getElementById('equipment2')?.value || '',
            equipmentNotes2: document.getElementById('equipmentNotes2')?.value || '',
            equipment3: document.getElementById('equipment3')?.value || '',
            equipmentNotes3: document.getElementById('equipmentNotes3')?.value || '',
            equipment4: document.getElementById('equipment4')?.value || '',
            equipmentNotes4: document.getElementById('equipmentNotes4')?.value || '',
            equipment5: document.getElementById('equipment5')?.value || '',
            equipmentNotes5: document.getElementById('equipmentNotes5')?.value || '',
            equipment6: document.getElementById('equipment6')?.value || '',
            equipmentNotes6: document.getElementById('equipmentNotes6')?.value || '',
            equipment7: document.getElementById('equipment7')?.value || '',
            equipmentNotes7: document.getElementById('equipmentNotes7')?.value || '',
            equipment8: document.getElementById('equipment8')?.value || '',
            equipmentNotes8: document.getElementById('equipmentNotes8')?.value || '',
            equipment9: document.getElementById('equipment9')?.value || '',
            equipmentNotes9: document.getElementById('equipmentNotes9')?.value || '',
            equipment10: document.getElementById('equipment10')?.value || '',
            equipmentNotes10: document.getElementById('equipmentNotes10')?.value || '',
            equipment11: document.getElementById('equipment11')?.value || '',
            equipmentNotes11: document.getElementById('equipmentNotes11')?.value || '',
            equipment12: document.getElementById('equipment12')?.value || '',
            equipmentNotes12: document.getElementById('equipmentNotes12')?.value || '',
            equipment13: document.getElementById('equipment13')?.value || '',
            equipmentNotes13: document.getElementById('equipmentNotes13')?.value || '',
            equipment14: document.getElementById('equipment14')?.value || '',
            equipmentNotes14: document.getElementById('equipmentNotes14')?.value || '',
            equipment15: document.getElementById('equipment15')?.value || '',
            equipmentNotes15: document.getElementById('equipmentNotes15')?.value || '',
            equipment16: document.getElementById('equipment16')?.value || '',
            equipmentNotes16: document.getElementById('equipmentNotes16')?.value || '',
            equipment17: document.getElementById('equipment17')?.value || '',
            equipmentNotes17: document.getElementById('equipmentNotes17')?.value || '',
            equipment18: document.getElementById('equipment18')?.value || '',
            equipmentNotes18: document.getElementById('equipmentNotes18')?.value || '',
            
            // Image and Lifestyle
            imageStyle: document.getElementById('imageStyle')?.value || '',
            housing: document.getElementById('housing')?.value || '',
            rent: document.getElementById('rent')?.value || '',
            lifestyle: document.getElementById('lifestyle')?.value || '',
            roleplayPath: document.getElementById('roleplayPath')?.value || '',
            
            // Cybernetics checkboxes
            cyberAudio: document.getElementById('cyberAudio')?.checked || false,
            rightEye: document.getElementById('rightEye')?.checked || false,
            rightArm: document.getElementById('rightArm')?.checked || false,
            rightLeg: document.getElementById('rightLeg')?.checked || false,
            interface: document.getElementById('interface')?.checked || false,
            leftEye: document.getElementById('leftEye')?.checked || false,
            leftArm: document.getElementById('leftArm')?.checked || false,
            leftLeg: document.getElementById('leftLeg')?.checked || false,
            
            // Audio implants
            audioImplant1: document.getElementById('audioImplant1')?.value || '',
            audioInfo1: document.getElementById('audioInfo1')?.value || '',
            audioImplant2: document.getElementById('audioImplant2')?.value || '',
            audioInfo2: document.getElementById('audioInfo2')?.value || '',
            audioImplant3: document.getElementById('audioImplant3')?.value || '',
            audioInfo3: document.getElementById('audioInfo3')?.value || '',
            
            // Right eye implants
            rightEyeImplant1: document.getElementById('rightEyeImplant1')?.value || '',
            rightEyeInfo1: document.getElementById('rightEyeInfo1')?.value || '',
            rightEyeImplant2: document.getElementById('rightEyeImplant2')?.value || '',
            rightEyeInfo2: document.getElementById('rightEyeInfo2')?.value || '',
            rightEyeImplant3: document.getElementById('rightEyeImplant3')?.value || '',
            rightEyeInfo3: document.getElementById('rightEyeInfo3')?.value || '',
            
            // Left eye implants
            leftEyeImplant1: document.getElementById('leftEyeImplant1')?.value || '',
            leftEyeInfo1: document.getElementById('leftEyeInfo1')?.value || '',
            leftEyeImplant2: document.getElementById('leftEyeImplant2')?.value || '',
            leftEyeInfo2: document.getElementById('leftEyeInfo2')?.value || '',
            leftEyeImplant3: document.getElementById('leftEyeImplant3')?.value || '',
            leftEyeInfo3: document.getElementById('leftEyeInfo3')?.value || '',
            
            // Right arm implants
            rightArmImplant1: document.getElementById('rightArmImplant1')?.value || '',
            rightArmInfo1: document.getElementById('rightArmInfo1')?.value || '',
            rightArmImplant2: document.getElementById('rightArmImplant2')?.value || '',
            rightArmInfo2: document.getElementById('rightArmInfo2')?.value || '',
            rightArmImplant3: document.getElementById('rightArmImplant3')?.value || '',
            rightArmInfo3: document.getElementById('rightArmInfo3')?.value || '',
            
            // Left arm implants
            leftArmImplant1: document.getElementById('leftArmImplant1')?.value || '',
            leftArmInfo1: document.getElementById('leftArmInfo1')?.value || '',
            leftArmImplant2: document.getElementById('leftArmImplant2')?.value || '',
            leftArmInfo2: document.getElementById('leftArmInfo2')?.value || '',
            leftArmImplant3: document.getElementById('leftArmImplant3')?.value || '',
            leftArmInfo3: document.getElementById('leftArmInfo3')?.value || '',
            
            // Neurointerface implants
            neuroInterfaceImplant1: document.getElementById('neuroInterfaceImplant1')?.value || '',
            neuroInterfaceInfo1: document.getElementById('neuroInterfaceInfo1')?.value || '',
            neuroInterfaceImplant2: document.getElementById('neuroInterfaceImplant2')?.value || '',
            neuroInterfaceInfo2: document.getElementById('neuroInterfaceInfo2')?.value || '',
            neuroInterfaceImplant3: document.getElementById('neuroInterfaceImplant3')?.value || '',
            neuroInterfaceInfo3: document.getElementById('neuroInterfaceInfo3')?.value || '',
            neuroInterfaceImplant4: document.getElementById('neuroInterfaceImplant4')?.value || '',
            neuroInterfaceInfo4: document.getElementById('neuroInterfaceInfo4')?.value || '',
            
            // Right leg implants
            rightLegImplant1: document.getElementById('rightLegImplant1')?.value || '',
            rightLegInfo1: document.getElementById('rightLegInfo1')?.value || '',
            rightLegImplant2: document.getElementById('rightLegImplant2')?.value || '',
            rightLegInfo2: document.getElementById('rightLegInfo2')?.value || '',
            rightLegImplant3: document.getElementById('rightLegImplant3')?.value || '',
            rightLegInfo3: document.getElementById('rightLegInfo3')?.value || '',
            
            // Left leg implants
            leftLegImplant1: document.getElementById('leftLegImplant1')?.value || '',
            leftLegInfo1: document.getElementById('leftLegInfo1')?.value || '',
            leftLegImplant2: document.getElementById('leftLegImplant2')?.value || '',
            leftLegInfo2: document.getElementById('leftLegInfo2')?.value || '',
            leftLegImplant3: document.getElementById('leftLegImplant3')?.value || '',
            leftLegInfo3: document.getElementById('leftLegInfo3')?.value || '',
            
            // Internal implants (7)
            internalImplant1: document.getElementById('internalImplant1')?.value || '',
            internalInfo1: document.getElementById('internalInfo1')?.value || '',
            internalImplant2: document.getElementById('internalImplant2')?.value || '',
            internalInfo2: document.getElementById('internalInfo2')?.value || '',
            internalImplant3: document.getElementById('internalImplant3')?.value || '',
            internalInfo3: document.getElementById('internalInfo3')?.value || '',
            internalImplant4: document.getElementById('internalImplant4')?.value || '',
            internalInfo4: document.getElementById('internalInfo4')?.value || '',
            internalImplant5: document.getElementById('internalImplant5')?.value || '',
            internalInfo5: document.getElementById('internalInfo5')?.value || '',
            internalImplant6: document.getElementById('internalImplant6')?.value || '',
            internalInfo6: document.getElementById('internalInfo6')?.value || '',
            internalImplant7: document.getElementById('internalImplant7')?.value || '',
            internalInfo7: document.getElementById('internalInfo7')?.value || '',
            
            // External implants (7)
            externalImplant1: document.getElementById('externalImplant1')?.value || '',
            externalInfo1: document.getElementById('externalInfo1')?.value || '',
            externalImplant2: document.getElementById('externalImplant2')?.value || '',
            externalInfo2: document.getElementById('externalInfo2')?.value || '',
            externalImplant3: document.getElementById('externalImplant3')?.value || '',
            externalInfo3: document.getElementById('externalInfo3')?.value || '',
            externalImplant4: document.getElementById('externalImplant4')?.value || '',
            externalInfo4: document.getElementById('externalInfo4')?.value || '',
            externalImplant5: document.getElementById('externalImplant5')?.value || '',
            externalInfo5: document.getElementById('externalInfo5')?.value || '',
            externalImplant6: document.getElementById('externalImplant6')?.value || '',
            externalInfo6: document.getElementById('externalInfo6')?.value || '',
            externalImplant7: document.getElementById('externalImplant7')?.value || '',
            externalInfo7: document.getElementById('externalInfo7')?.value || '',
            
            // Stylish implants (7)
            stylishImplant1: document.getElementById('stylishImplant1')?.value || '',
            stylishInfo1: document.getElementById('stylishInfo1')?.value || '',
            stylishImplant2: document.getElementById('stylishImplant2')?.value || '',
            stylishInfo2: document.getElementById('stylishInfo2')?.value || '',
            stylishImplant3: document.getElementById('stylishImplant3')?.value || '',
            stylishInfo3: document.getElementById('stylishInfo3')?.value || '',
            stylishImplant4: document.getElementById('stylishImplant4')?.value || '',
            stylishInfo4: document.getElementById('stylishInfo4')?.value || '',
            stylishImplant5: document.getElementById('stylishImplant5')?.value || '',
            stylishInfo5: document.getElementById('stylishInfo5')?.value || '',
            stylishImplant6: document.getElementById('stylishImplant6')?.value || '',
            stylishInfo6: document.getElementById('stylishInfo6')?.value || '',
            stylishImplant7: document.getElementById('stylishImplant7')?.value || '',
            stylishInfo7: document.getElementById('stylishInfo7')?.value || '',
            
            // Borg implants (7)
            borg1: document.getElementById('borg1')?.value || '',
            borgInfo1: document.getElementById('borgInfo1')?.value || '',
            borg2: document.getElementById('borg2')?.value || '',
            borgInfo2: document.getElementById('borgInfo2')?.value || '',
            borg3: document.getElementById('borg3')?.value || '',
            borgInfo3: document.getElementById('borgInfo3')?.value || '',
            borg4: document.getElementById('borg4')?.value || '',
            borgInfo4: document.getElementById('borgInfo4')?.value || '',
            borg5: document.getElementById('borg5')?.value || '',
            borgInfo5: document.getElementById('borgInfo5')?.value || '',
            borg6: document.getElementById('borg6')?.value || '',
            borgInfo6: document.getElementById('borgInfo6')?.value || '',
            borg7: document.getElementById('borg7')?.value || '',
            borgInfo7: document.getElementById('borgInfo7')?.value || '',
            
            // Metadata
            createdAt: new Date().toISOString(),
            createdBy: currentUser.username
        };
    }
    
    function handleSavePdf() {
        collectCharacterData();
        
        // Send character data to backend to generate PDF
        fetch('/api/fill-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentCharacterData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Character saved successfully!');
                // Reload saved characters list
                loadSavedCharacters();
            } else {
                alert('Error saving character: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while saving the character');
        });
    }
    
    function handleDownloadPdf() {
        // In a real implementation, this would send data to the backend
        // which would fill the PDF template and return the filled PDF
        collectCharacterData();
        
        // For now, we'll simulate the download by sending the data to backend
        fetch('/api/fill-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(currentCharacterData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Create a temporary link to download the PDF
                const link = document.createElement('a');
                link.href = data.downloadUrl;
                link.download = `Character_${currentCharacterData.charName || 'Unknown'}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                alert('Error creating PDF: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the PDF');
        });
    }
    
    function loadSavedCharacters() {
        fetch('/api/characters')
        .then(response => response.json())
        .then(characters => {
            pdfList.innerHTML = '';
            
            if (characters.length === 0) {
                pdfList.innerHTML = '<p>No saved characters.</p>';
                return;
            }
            
            characters.forEach((character, index) => {
                const div = document.createElement('div');
                div.className = 'pdf-item';
                div.innerHTML = `
                    <span>${character.charName || 'Unnamed Character'} - ${new Date(character.createdAt).toLocaleDateString()}</span>
                    <button onclick="loadCharacter(${index})">Load</button>
                    <button onclick="downloadCharacterPdf('${character.id}', '${character.filename || ''}')">Download</button>
                `;
                pdfList.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error loading saved characters:', error);
            pdfList.innerHTML = '<p>Error loading saved characters.</p>';
        });
    }
    
    // Make functions available globally for inline handlers
    window.loadCharacter = function(index) {
        // This would load character data from backend in a full implementation
        alert('Loading character at index: ' + index);
    };
    
    window.downloadCharacterPdf = function(characterId, filename) {
        // Create download link for the character PDF
        if (filename) {
            const link = document.createElement('a');
            link.href = `/api/download/${filename}`;
            link.download = `Character_${filename}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('No file found for this character');
        }
    };
    
    function fillFormWithCharacter(character) {
        // Fill basic info
        document.getElementById('charName').value = character.charName || '';
        document.getElementById('charRole').value = character.charRole || '';
        document.getElementById('charRank').value = character.charRank || '';
        document.getElementById('charNotes').value = character.charNotes || '';
        document.getElementById('charHealth').value = character.charHealth || '';
        
        // Fill characteristics
        if (character.intellect) {
            document.getElementById('intellect').value = character.intellect[0] || '';
            document.getElementById('intellect2').value = character.intellect[1] || '';
            document.getElementById('intellect3').value = character.intellect[2] || '';
        }
        
        if (character.reaction) {
            document.getElementById('reaction').value = character.reaction[0] || '';
            document.getElementById('reaction2').value = character.reaction[1] || '';
            document.getElementById('reaction3').value = character.reaction[2] || '';
        }
        
        if (character.reflexes) {
            document.getElementById('reflexes').value = character.reflexes[0] || '';
            document.getElementById('reflexes2').value = character.reflexes[1] || '';
            document.getElementById('reflexes3').value = character.reflexes[2] || '';
        }
        
        if (character.tech) {
            document.getElementById('tech').value = character.tech[0] || '';
            document.getElementById('tech2').value = character.tech[1] || '';
            document.getElementById('tech3').value = character.tech[2] || '';
        }
        
        if (character.charisma) {
            document.getElementById('charisma').value = character.charisma[0] || '';
            document.getElementById('charisma2').value = character.charisma[1] || '';
            document.getElementById('charisma3').value = character.charisma[2] || '';
        }
        
        if (character.will) {
            document.getElementById('will').value = character.will[0] || '';
            document.getElementById('will2').value = character.will[1] || '';
            document.getElementById('will3').value = character.will[2] || '';
        }
        
        document.getElementById('luck').value = character.luck || '';
        document.getElementById('speed').value = character.speed || '';
        document.getElementById('body').value = character.body || '';
        
        // Fill skills
        document.getElementById('concentration').value = character.concentration || '';
        document.getElementById('hideObject').value = character.hideObject || '';
        document.getElementById('lipReading').value = character.lipReading || '';
        document.getElementById('attention').value = character.attention || '';
        document.getElementById('tracking').value = character.tracking || '';
        
        document.getElementById('athletics').value = character.athletics || '';
        document.getElementById('acrobatics').value = character.acrobatics || '';
        document.getElementById('dance').value = character.dance || '';
        document.getElementById('endurance').value = character.endurance || '';
        document.getElementById('resistance').value = character.resistance || '';
        document.getElementById('stealth').value = character.stealth || '';
        
        document.getElementById('driving').value = character.driving || '';
        document.getElementById('piloting').value = character.piloting || '';
        document.getElementById('navigation').value = character.navigation || '';
        document.getElementById('riding').value = character.riding || '';
        
        document.getElementById('accounting').value = character.accounting || '';
        document.getElementById('animals').value = character.animals || '';
        document.getElementById('bureaucracy').value = character.bureaucracy || '';
        document.getElementById('business').value = character.business || '';
        document.getElementById('composition').value = character.composition || '';
        document.getElementById('criminology').value = character.criminology || '';
        document.getElementById('cryptography').value = character.cryptography || '';
        document.getElementById('deduction').value = character.deduction || '';
        document.getElementById('education').value = character.education || '';
        document.getElementById('gambling').value = character.gambling || '';
        
        document.getElementById('slang').value = character.slang || '';
        document.getElementById('language1').value = character.language1 || '';
        document.getElementById('language1Name').value = character.language1Name || '';
        document.getElementById('language2').value = character.language2 || '';
        document.getElementById('language2Name').value = character.language2Name || '';
        
        document.getElementById('infoSearch').value = character.infoSearch || '';
        
        document.getElementById('homeArea').value = character.homeArea || '';
        document.getElementById('area1').value = character.area1 || '';
        document.getElementById('area1Name').value = character.area1Name || '';
        document.getElementById('area1stat').value = character.area1stat || '';
        document.getElementById('area2').value = character.area2 || '';
        document.getElementById('area2Name').value = character.area2Name || '';
        document.getElementById('area2stat').value = character.area2stat || '';
        
        document.getElementById('tactics').value = character.tactics || '';
        document.getElementById('desertSurvival').value = character.desertSurvival || '';
        
        document.getElementById('melee').value = character.melee || '';
        document.getElementById('dodge').value = character.dodge || '';
        document.getElementById('martialArts').value = character.martialArts || '';
        document.getElementById('meleeWeapons').value = character.meleeWeapons || '';
        
        document.getElementById('acting').value = character.acting || '';
        
        document.getElementById('instrument1').value = character.instrument1 || '';
        document.getElementById('instrument1Name').value = character.instrument1Name || '';
        document.getElementById('instrument1stat').value = character.instrument1stat || '';
        document.getElementById('instrument2').value = character.instrument2 || '';
        document.getElementById('instrument2Name').value = character.instrument2Name || '';
        document.getElementById('instrument2stat').value = character.instrument2stat || '';
        
        document.getElementById('archery').value = character.archery || '';
        document.getElementById('automaticFire').value = character.automaticFire || '';
        document.getElementById('pistols').value = character.pistols || '';
        document.getElementById('heavyWeapons').value = character.heavyWeapons || '';
        document.getElementById('tacticalWeapons').value = character.tacticalWeapons || '';
        
        document.getElementById('bribery').value = character.bribery || '';
        document.getElementById('conversation').value = character.conversation || '';
        document.getElementById('insight').value = character.insight || '';
        document.getElementById('interrogation').value = character.interrogation || '';
        document.getElementById('persuasion').value = character.persuasion || '';
        document.getElementById('selfCare').value = character.selfCare || '';
        document.getElementById('streetWise').value = character.streetWise || '';
        document.getElementById('trading').value = character.trading || '';
        document.getElementById('wardrobe').value = character.wardrobe || '';
        
        document.getElementById('aviationTech').value = character.aviationTech || '';
        document.getElementById('techKnowledge').value = character.techKnowledge || '';
        document.getElementById('cyberTech').value = character.cyberTech || '';
        document.getElementById('demolitions').value = character.demolitions || '';
        document.getElementById('electronics').value = character.electronics || '';
        document.getElementById('firstAid').value = character.firstAid || '';
        document.getElementById('falsification').value = character.falsification || '';
        document.getElementById('automotive').value = character.automotive || '';
        document.getElementById('craft').value = character.craft || '';
        document.getElementById('paramedic').value = character.paramedic || '';
        document.getElementById('photoVideo').value = character.photoVideo || '';
        document.getElementById('locksmith').value = character.locksmith || '';
        document.getElementById('pickpocket').value = character.pickpocket || '';
        document.getElementById('marineTech').value = character.marineTech || '';
        document.getElementById('weaponsmith').value = character.weaponsmith || '';
        
        // Fill Life Path
        document.getElementById('pseudonyms').value = character.pseudonyms || '';
        document.getElementById('heritage').value = character.heritage || '';
        document.getElementById('personality').value = character.personality || '';
        document.getElementById('style').value = character.style || '';
        document.getElementById('valuesMost').value = character.valuesMost || '';
        document.getElementById('closestPerson').value = character.closestPerson || '';
        document.getElementById('familyHistory').value = character.familyHistory || '';
        document.getElementById('familyCrisis').value = character.familyCrisis || '';
        document.getElementById('haircut').value = character.haircut || '';
        document.getElementById('attitudePeople').value = character.attitudePeople || '';
        document.getElementById('valuablePossession').value = character.valuablePossession || '';
        document.getElementById('lifeGoals').value = character.lifeGoals || '';
        
        document.getElementById('friend1').value = character.friend1 || '';
        document.getElementById('friend2').value = character.friend2 || '';
        document.getElementById('friend3').value = character.friend3 || '';
        
        document.getElementById('tragicLove1').value = character.tragicLove1 || '';
        document.getElementById('tragicLove2').value = character.tragicLove2 || '';
        document.getElementById('tragicLove3').value = character.tragicLove3 || '';
        
        document.getElementById('enemy1').value = character.enemy1 || '';
        document.getElementById('enemy1Reason').value = character.enemy1Reason || '';
        document.getElementById('enemy1Action').value = character.enemy1Action || '';
        document.getElementById('enemy1Outcome').value = character.enemy1Outcome || '';
        
        document.getElementById('enemy2').value = character.enemy2 || '';
        document.getElementById('enemy2Reason').value = character.enemy2Reason || '';
        document.getElementById('enemy2Action').value = character.enemy2Action || '';
        document.getElementById('enemy2Outcome').value = character.enemy2Outcome || '';
        
        document.getElementById('enemy3').value = character.enemy3 || '';
        document.getElementById('enemy3Reason').value = character.enemy3Reason || '';
        document.getElementById('enemy3Action').value = character.enemy3Action || '';
        document.getElementById('enemy3Outcome').value = character.enemy3Outcome || '';
        
        // Fill Equipment
        document.getElementById('equipment1').value = character.equipment1 || '';
        document.getElementById('equipmentNotes1').value = character.equipmentNotes1 || '';
        document.getElementById('equipment2').value = character.equipment2 || '';
        document.getElementById('equipmentNotes2').value = character.equipmentNotes2 || '';
        document.getElementById('equipment3').value = character.equipment3 || '';
        document.getElementById('equipmentNotes3').value = character.equipmentNotes3 || '';
        document.getElementById('equipment4').value = character.equipment4 || '';
        document.getElementById('equipmentNotes4').value = character.equipmentNotes4 || '';
        document.getElementById('equipment5').value = character.equipment5 || '';
        document.getElementById('equipmentNotes5').value = character.equipmentNotes5 || '';
        document.getElementById('equipment6').value = character.equipment6 || '';
        document.getElementById('equipmentNotes6').value = character.equipmentNotes6 || '';
        document.getElementById('equipment7').value = character.equipment7 || '';
        document.getElementById('equipmentNotes7').value = character.equipmentNotes7 || '';
        document.getElementById('equipment8').value = character.equipment8 || '';
        document.getElementById('equipmentNotes8').value = character.equipmentNotes8 || '';
        document.getElementById('equipment9').value = character.equipment9 || '';
        document.getElementById('equipmentNotes9').value = character.equipmentNotes9 || '';
        document.getElementById('equipment10').value = character.equipment10 || '';
        document.getElementById('equipmentNotes10').value = character.equipmentNotes10 || '';
        document.getElementById('equipment11').value = character.equipment11 || '';
        document.getElementById('equipmentNotes11').value = character.equipmentNotes11 || '';
        document.getElementById('equipment12').value = character.equipment12 || '';
        document.getElementById('equipmentNotes12').value = character.equipmentNotes12 || '';
        document.getElementById('equipment13').value = character.equipment13 || '';
        document.getElementById('equipmentNotes13').value = character.equipmentNotes13 || '';
        document.getElementById('equipment14').value = character.equipment14 || '';
        document.getElementById('equipmentNotes14').value = character.equipmentNotes14 || '';
        document.getElementById('equipment15').value = character.equipment15 || '';
        document.getElementById('equipmentNotes15').value = character.equipmentNotes15 || '';
        document.getElementById('equipment16').value = character.equipment16 || '';
        document.getElementById('equipmentNotes16').value = character.equipmentNotes16 || '';
        document.getElementById('equipment17').value = character.equipment17 || '';
        document.getElementById('equipmentNotes17').value = character.equipmentNotes17 || '';
        document.getElementById('equipment18').value = character.equipment18 || '';
        document.getElementById('equipmentNotes18').value = character.equipmentNotes18 || '';
        
        // Fill Image and Lifestyle
        document.getElementById('imageStyle').value = character.imageStyle || '';
        document.getElementById('housing').value = character.housing || '';
        document.getElementById('rent').value = character.rent || '';
        document.getElementById('lifestyle').value = character.lifestyle || '';
        document.getElementById('roleplayPath').value = character.roleplayPath || '';
        
        // Fill Cybernetics checkboxes
        document.getElementById('cyberAudio').checked = character.cyberAudio || false;
        document.getElementById('rightEye').checked = character.rightEye || false;
        document.getElementById('rightArm').checked = character.rightArm || false;
        document.getElementById('rightLeg').checked = character.rightLeg || false;
        document.getElementById('interface').checked = character.interface || false;
        document.getElementById('leftEye').checked = character.leftEye || false;
        document.getElementById('leftArm').checked = character.leftArm || false;
        document.getElementById('leftLeg').checked = character.leftLeg || false;
        
        // Fill Cybernetic implants
        document.getElementById('audioImplant1').value = character.audioImplant1 || '';
        document.getElementById('audioInfo1').value = character.audioInfo1 || '';
        document.getElementById('audioImplant2').value = character.audioImplant2 || '';
        document.getElementById('audioInfo2').value = character.audioInfo2 || '';
        document.getElementById('audioImplant3').value = character.audioImplant3 || '';
        document.getElementById('audioInfo3').value = character.audioInfo3 || '';
        
        document.getElementById('rightEyeImplant1').value = character.rightEyeImplant1 || '';
        document.getElementById('rightEyeInfo1').value = character.rightEyeInfo1 || '';
        document.getElementById('rightEyeImplant2').value = character.rightEyeImplant2 || '';
        document.getElementById('rightEyeInfo2').value = character.rightEyeInfo2 || '';
        document.getElementById('rightEyeImplant3').value = character.rightEyeImplant3 || '';
        document.getElementById('rightEyeInfo3').value = character.rightEyeInfo3 || '';
        
        document.getElementById('leftEyeImplant1').value = character.leftEyeImplant1 || '';
        document.getElementById('leftEyeInfo1').value = character.leftEyeInfo1 || '';
        document.getElementById('leftEyeImplant2').value = character.leftEyeImplant2 || '';
        document.getElementById('leftEyeInfo2').value = character.leftEyeInfo2 || '';
        document.getElementById('leftEyeImplant3').value = character.leftEyeImplant3 || '';
        document.getElementById('leftEyeInfo3').value = character.leftEyeInfo3 || '';
        
        document.getElementById('rightArmImplant1').value = character.rightArmImplant1 || '';
        document.getElementById('rightArmInfo1').value = character.rightArmInfo1 || '';
        document.getElementById('rightArmImplant2').value = character.rightArmImplant2 || '';
        document.getElementById('rightArmInfo2').value = character.rightArmInfo2 || '';
        document.getElementById('rightArmImplant3').value = character.rightArmImplant3 || '';
        document.getElementById('rightArmInfo3').value = character.rightArmInfo3 || '';
        
        document.getElementById('leftArmImplant1').value = character.leftArmImplant1 || '';
        document.getElementById('leftArmInfo1').value = character.leftArmInfo1 || '';
        document.getElementById('leftArmImplant2').value = character.leftArmImplant2 || '';
        document.getElementById('leftArmInfo2').value = character.leftArmInfo2 || '';
        document.getElementById('leftArmImplant3').value = character.leftArmImplant3 || '';
        document.getElementById('leftArmInfo3').value = character.leftArmInfo3 || '';
        
        document.getElementById('neuroInterfaceImplant1').value = character.neuroInterfaceImplant1 || '';
        document.getElementById('neuroInterfaceInfo1').value = character.neuroInterfaceInfo1 || '';
        document.getElementById('neuroInterfaceImplant2').value = character.neuroInterfaceImplant2 || '';
        document.getElementById('neuroInterfaceInfo2').value = character.neuroInterfaceInfo2 || '';
        document.getElementById('neuroInterfaceImplant3').value = character.neuroInterfaceImplant3 || '';
        document.getElementById('neuroInterfaceInfo3').value = character.neuroInterfaceInfo3 || '';
        document.getElementById('neuroInterfaceImplant4').value = character.neuroInterfaceImplant4 || '';
        document.getElementById('neuroInterfaceInfo4').value = character.neuroInterfaceInfo4 || '';
        
        document.getElementById('rightLegImplant1').value = character.rightLegImplant1 || '';
        document.getElementById('rightLegInfo1').value = character.rightLegInfo1 || '';
        document.getElementById('rightLegImplant2').value = character.rightLegImplant2 || '';
        document.getElementById('rightLegInfo2').value = character.rightLegInfo2 || '';
        document.getElementById('rightLegImplant3').value = character.rightLegImplant3 || '';
        document.getElementById('rightLegInfo3').value = character.rightLegInfo3 || '';
        
        document.getElementById('leftLegImplant1').value = character.leftLegImplant1 || '';
        document.getElementById('leftLegInfo1').value = character.leftLegInfo1 || '';
        document.getElementById('leftLegImplant2').value = character.leftLegImplant2 || '';
        document.getElementById('leftLegInfo2').value = character.leftLegInfo2 || '';
        document.getElementById('leftLegImplant3').value = character.leftLegImplant3 || '';
        document.getElementById('leftLegInfo3').value = character.leftLegInfo3 || '';
        
        document.getElementById('internalImplant1').value = character.internalImplant1 || '';
        document.getElementById('internalInfo1').value = character.internalInfo1 || '';
        document.getElementById('internalImplant2').value = character.internalImplant2 || '';
        document.getElementById('internalInfo2').value = character.internalInfo2 || '';
        document.getElementById('internalImplant3').value = character.internalImplant3 || '';
        document.getElementById('internalInfo3').value = character.internalInfo3 || '';
        document.getElementById('internalImplant4').value = character.internalImplant4 || '';
        document.getElementById('internalInfo4').value = character.internalInfo4 || '';
        document.getElementById('internalImplant5').value = character.internalImplant5 || '';
        document.getElementById('internalInfo5').value = character.internalInfo5 || '';
        document.getElementById('internalImplant6').value = character.internalImplant6 || '';
        document.getElementById('internalInfo6').value = character.internalInfo6 || '';
        document.getElementById('internalImplant7').value = character.internalImplant7 || '';
        document.getElementById('internalInfo7').value = character.internalInfo7 || '';
        
        document.getElementById('externalImplant1').value = character.externalImplant1 || '';
        document.getElementById('externalInfo1').value = character.externalInfo1 || '';
        document.getElementById('externalImplant2').value = character.externalImplant2 || '';
        document.getElementById('externalInfo2').value = character.externalInfo2 || '';
        document.getElementById('externalImplant3').value = character.externalImplant3 || '';
        document.getElementById('externalInfo3').value = character.externalInfo3 || '';
        document.getElementById('externalImplant4').value = character.externalImplant4 || '';
        document.getElementById('externalInfo4').value = character.externalInfo4 || '';
        document.getElementById('externalImplant5').value = character.externalImplant5 || '';
        document.getElementById('externalInfo5').value = character.externalInfo5 || '';
        document.getElementById('externalImplant6').value = character.externalImplant6 || '';
        document.getElementById('externalInfo6').value = character.externalInfo6 || '';
        document.getElementById('externalImplant7').value = character.externalImplant7 || '';
        document.getElementById('externalInfo7').value = character.externalInfo7 || '';
        
        document.getElementById('stylishImplant1').value = character.stylishImplant1 || '';
        document.getElementById('stylishInfo1').value = character.stylishInfo1 || '';
        document.getElementById('stylishImplant2').value = character.stylishImplant2 || '';
        document.getElementById('stylishInfo2').value = character.stylishInfo2 || '';
        document.getElementById('stylishImplant3').value = character.stylishImplant3 || '';
        document.getElementById('stylishInfo3').value = character.stylishInfo3 || '';
        document.getElementById('stylishImplant4').value = character.stylishImplant4 || '';
        document.getElementById('stylishInfo4').value = character.stylishInfo4 || '';
        document.getElementById('stylishImplant5').value = character.stylishImplant5 || '';
        document.getElementById('stylishInfo5').value = character.stylishInfo5 || '';
        document.getElementById('stylishImplant6').value = character.stylishImplant6 || '';
        document.getElementById('stylishInfo6').value = character.stylishInfo6 || '';
        document.getElementById('stylishImplant7').value = character.stylishImplant7 || '';
        document.getElementById('stylishInfo7').value = character.stylishInfo7 || '';
        
        document.getElementById('borg1').value = character.borg1 || '';
        document.getElementById('borgInfo1').value = character.borgInfo1 || '';
        document.getElementById('borg2').value = character.borg2 || '';
        document.getElementById('borgInfo2').value = character.borgInfo2 || '';
        document.getElementById('borg3').value = character.borg3 || '';
        document.getElementById('borgInfo3').value = character.borgInfo3 || '';
        document.getElementById('borg4').value = character.borg4 || '';
        document.getElementById('borgInfo4').value = character.borgInfo4 || '';
        document.getElementById('borg5').value = character.borg5 || '';
        document.getElementById('borgInfo5').value = character.borgInfo5 || '';
        document.getElementById('borg6').value = character.borg6 || '';
        document.getElementById('borgInfo6').value = character.borgInfo6 || '';
        document.getElementById('borg7').value = character.borg7 || '';
        document.getElementById('borgInfo7').value = character.borgInfo7 || '';
        
        // Update current character data
        currentCharacterData = character;
    }
});