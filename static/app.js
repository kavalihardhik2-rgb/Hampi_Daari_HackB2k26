/* Hampi Daari front end. Plain JavaScript, no build step. */
(function () {
  'use strict';

  // ---------- words on screen, in three languages ----------
  var T = {
    en: {
      tagline: 'Every monument. Every fact with its source.',
      tabMap: 'Map', tabPlaces: 'Places', tabGuide: 'Guide', tabPlan: 'Plan', tabSigns: 'Signs',
      setLoc: 'Tap map to set my spot', useGps: 'Use GPS', tapNow: 'Now tap the map',
      nearYou: 'Closest to you', away: 'away',
      seen: 'Seen', markSeen: 'Mark as seen', listen: 'Listen', stop: 'Stop',
      seenCount: 'You have seen {a} of {b} monuments',
      recorded: 'On record', tradition: 'Story', uncertain: 'Not known for sure',
      source: 'Source', tip: 'Before you go', showMap: 'Show on map', printSign: 'Signboard',
      factsEnglish: 'Detailed facts are in English for now.',
      modeCheck: 'Check a claim', modeAsk: 'Ask a question', go: 'Go',
      hintCheck: 'Type what a guide told you. The app compares it with the record.',
      hintAsk: 'Ask about any monument. If the app has no record, it says so.',
      phCheck: 'e.g. The musical pillars are hollow', phAsk: 'e.g. How tall is the Narasimha statue?',
      englishOnly: 'Questions work in English for now.',
      startFrom: 'Start from', timeAvail: 'Time you have', walk: 'Walk', cycle: 'Cycle', auto: 'Auto', bike: 'Bike', car: 'Car',
      planBtn: 'Plan my visit', myLoc: 'My spot on the map',
      planSum: '{n} of {t} monuments in {h}, {k} km', skipped: 'Will not fit in this time', tapAdd: 'Tap one to make it a must-see. The plan will drop something smaller.', resetMust: 'Clear my must-sees',
      atSite: 'min here', arrive: 'Reach at', overBudget: 'Your chosen places need more time than you have.', planNote: 'Times and distances are estimates from straight-line distance, not turn-by-turn directions.', noRecord: 'No record',
      signsTitle: 'A signboard for every monument',
      signsText: 'Hampi has very few signs. Each printed board carries a QR code. Scanning it opens that monument here, with no app to install.',
      signsBtn: 'Open printable signboards', error: 'Something went wrong. Is the server running?',
      needsInternet: 'Needs internet',
      nearbyTitle: 'Stays, food and water nearby',
      stayTonight: 'Where to stay tonight (near your last stop)',
      findNearby: 'Find places near here',
      nearbyNote: 'Live data from OpenStreetMap. Not checked by us: call ahead before you go.',
      nearbyNone: 'Nothing listed on OpenStreetMap close to here. Try the Google Maps links above.',
      nearbyFail: 'Could not load live places right now. The Google Maps links above still work.',
      k_stay: 'Stays',
      k_food: 'Food',
      k_water: 'Drinking water',
      k_toilet: 'Toilets',
      k_atm: 'ATM / bank',
      k_shop: 'Shops',
      stayNear: 'Tonight, stay near here',
      grpHours: 'Hours', grpDays: 'Days / Multi-Day',
      h2: '2 h', h4: '4 h', h6: '6 h', h8: '8 h',
      d1: '1 Day (Full day)', d2: '2 Days', d3: '3 Days', w1: '1 Week (Complete tour)',
      dayPlan: 'Day {d}',
      photoLookup: 'Identify from photo', photoMatch: 'Photo match', quickIdentify: 'Or identify by key feature', uploadOrSnap: 'Upload / Snap photo',
      audiobook: 'Audio Guide & Story', briefAudio: '⚡ Brief Audio', fullAudio: '📖 Full Story / Audiobook',
      playBrief: 'Play Brief Audio', playFull: 'Play Full Audiobook', pause: 'Pause', resume: 'Resume', replay: 'Replay',
      playing: 'Playing narrative...', paused: 'Audio paused', audioReady: 'Tap play to listen',
      scannedQr: '📍 Scanned from Signboard', voiceSiri: 'Siri / Natural Voice'
    },
    kn: {
      tagline: 'ಪ್ರತಿ ಸ್ಮಾರಕ. ಪ್ರತಿ ಮಾಹಿತಿಗೂ ಆಧಾರ.',
      tabMap: 'ನಕ್ಷೆ', tabPlaces: 'ಸ್ಥಳಗಳು', tabGuide: 'ಮಾರ್ಗದರ್ಶಿ', tabPlan: 'ಯೋಜನೆ', tabSigns: 'ಫಲಕಗಳು',
      setLoc: 'ನಕ್ಷೆಯಲ್ಲಿ ನನ್ನ ಸ್ಥಳ ಗುರುತಿಸಿ', useGps: 'GPS ಬಳಸಿ', tapNow: 'ಈಗ ನಕ್ಷೆಯ ಮೇಲೆ ಒತ್ತಿ',
      nearYou: 'ನಿಮಗೆ ಹತ್ತಿರದವು', away: 'ದೂರ',
      seen: 'ನೋಡಿದೆ', markSeen: 'ನೋಡಿದೆ ಎಂದು ಗುರುತಿಸಿ', listen: 'ಕೇಳಿ', stop: 'ನಿಲ್ಲಿಸಿ',
      seenCount: '{b} ಸ್ಮಾರಕಗಳಲ್ಲಿ {a} ನೋಡಿದ್ದೀರಿ',
      recorded: 'ದಾಖಲೆ ಇದೆ', tradition: 'ಐತಿಹ್ಯ', uncertain: 'ಖಚಿತವಿಲ್ಲ',
      source: 'ಆಧಾರ', tip: 'ಹೋಗುವ ಮುನ್ನ', showMap: 'ನಕ್ಷೆಯಲ್ಲಿ ತೋರಿಸಿ', printSign: 'ಫಲಕ',
      factsEnglish: 'ವಿವರವಾದ ಮಾಹಿತಿ ಸದ್ಯಕ್ಕೆ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿದೆ.',
      modeCheck: 'ಹೇಳಿಕೆ ಪರಿಶೀಲಿಸಿ', modeAsk: 'ಪ್ರಶ್ನೆ ಕೇಳಿ', go: 'ಹುಡುಕಿ',
      hintCheck: 'ಗೈಡ್ ಹೇಳಿದ್ದನ್ನು ಬರೆಯಿರಿ. ಆ್ಯಪ್ ಅದನ್ನು ದಾಖಲೆಯೊಂದಿಗೆ ಹೋಲಿಸುತ್ತದೆ.',
      hintAsk: 'ಯಾವುದೇ ಸ್ಮಾರಕದ ಬಗ್ಗೆ ಕೇಳಿ. ದಾಖಲೆಯಲ್ಲಿ ಉತ್ತರ ಇಲ್ಲದಿದ್ದರೆ ಆ್ಯಪ್ ಹಾಗೆಯೇ ಹೇಳುತ್ತದೆ.',
      phCheck: 'e.g. The musical pillars are hollow', phAsk: 'e.g. How tall is the Narasimha statue?',
      englishOnly: 'ಪ್ರಶ್ನೆಗಳು ಸದ್ಯಕ್ಕೆ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಮಾತ್ರ.',
      startFrom: 'ಆರಂಭದ ಸ್ಥಳ', timeAvail: 'ನಿಮ್ಮ ಬಳಿ ಇರುವ ಸಮಯ', walk: 'ನಡಿಗೆ', cycle: 'ಸೈಕಲ್', auto: 'ಆಟೋ', bike: 'ಬೈಕ್', car: 'ಕಾರು',
      planBtn: 'ನನ್ನ ಭೇಟಿ ಯೋಜಿಸಿ', myLoc: 'ನಕ್ಷೆಯಲ್ಲಿ ನನ್ನ ಸ್ಥಳ',
      planSum: '{t} ರಲ್ಲಿ {n} ಸ್ಮಾರಕಗಳು, {h}, {k} ಕಿ.ಮೀ', skipped: 'ಈ ಸಮಯದಲ್ಲಿ ಆಗುವುದಿಲ್ಲ', tapAdd: 'ನೋಡಲೇಬೇಕಾದ ಸ್ಥಳವನ್ನು ಒತ್ತಿ. ಯೋಜನೆ ಬದಲಾಗುತ್ತದೆ.', resetMust: 'ನನ್ನ ಆಯ್ಕೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ',
      atSite: 'ನಿಮಿಷ ಇಲ್ಲಿ', arrive: 'ತಲುಪುವ ಸಮಯ', overBudget: 'ನೀವು ಆರಿಸಿದ ಸ್ಥಳಗಳಿಗೆ ಹೆಚ್ಚು ಸಮಯ ಬೇಕು.', planNote: 'ಸಮಯ ಮತ್ತು ದೂರ ಅಂದಾಜು ಮಾತ್ರ. ಇದು ದಾರಿ ತೋರಿಸುವ ನಕ್ಷೆ ಅಲ್ಲ.', noRecord: 'ದಾಖಲೆ ಇಲ್ಲ',
      signsTitle: 'ಪ್ರತಿ ಸ್ಮಾರಕಕ್ಕೂ ಒಂದು ಫಲಕ',
      signsText: 'ಹಂಪಿಯಲ್ಲಿ ಫಲಕಗಳು ಬಹಳ ಕಡಿಮೆ. ಪ್ರತಿ ಫಲಕದಲ್ಲಿ QR ಕೋಡ್ ಇದೆ. ಸ್ಕ್ಯಾನ್ ಮಾಡಿದರೆ ಆ ಸ್ಮಾರಕದ ಮಾಹಿತಿ ತೆರೆಯುತ್ತದೆ.',
      signsBtn: 'ಮುದ್ರಿಸಬಹುದಾದ ಫಲಕಗಳನ್ನು ತೆರೆಯಿರಿ', error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ಸರ್ವರ್ ಚಾಲನೆಯಲ್ಲಿದೆಯೇ?',
      needsInternet: 'ಇಂಟರ್ನೆಟ್ ಬೇಕು',
      nearbyTitle: 'ಹತ್ತಿರದ ವಸತಿ, ಊಟ ಮತ್ತು ನೀರು',
      stayTonight: 'ಇಂದು ರಾತ್ರಿ ಎಲ್ಲಿ ಉಳಿಯಬೇಕು (ಕೊನೆಯ ಸ್ಥಳದ ಹತ್ತಿರ)',
      findNearby: 'ಇಲ್ಲಿ ಹತ್ತಿರದ ಸ್ಥಳಗಳನ್ನು ಹುಡುಕಿ',
      nearbyNote: 'OpenStreetMap ನಿಂದ ನೇರ ಮಾಹಿತಿ. ನಾವು ಪರಿಶೀಲಿಸಿಲ್ಲ: ಹೋಗುವ ಮೊದಲು ಕರೆ ಮಾಡಿ ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
      nearbyNone: 'ಇಲ್ಲಿ ಹತ್ತಿರ OpenStreetMap ನಲ್ಲಿ ಏನೂ ಇಲ್ಲ. ಮೇಲಿನ Google Maps ಲಿಂಕ್‌ಗಳನ್ನು ಬಳಸಿ.',
      nearbyFail: 'ಈಗ ನೇರ ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ. ಮೇಲಿನ Google Maps ಲಿಂಕ್‌ಗಳು ಕೆಲಸ ಮಾಡುತ್ತವೆ.',
      k_stay: 'ವಸತಿ',
      k_food: 'ಊಟ',
      k_water: 'ಕುಡಿಯುವ ನೀರು',
      k_toilet: 'ಶೌಚಾಲಯ',
      k_atm: 'ಎಟಿಎಂ / ಬ್ಯಾಂಕ್',
      k_shop: 'ಅಂಗಡಿಗಳು',
      stayNear: 'ಇಂದು ರಾತ್ರಿ ಇಲ್ಲಿ ಹತ್ತಿರ ಉಳಿಯಿರಿ',
      grpHours: 'ಗಂಟೆಗಳು', grpDays: 'ದಿನಗಳು / ಪ್ರವಾಸ',
      h2: '2 ಗಂ', h4: '4 ಗಂ', h6: '6 ಗಂ', h8: '8 ಗಂ',
      d1: '1 ದಿನ (ಪೂರ್ಣ ದಿನ)', d2: '2 ದಿನಗಳು', d3: '3 ದಿನಗಳು', w1: '1 ವಾರ (ಸಂಪೂರ್ಣ ಪ್ರವಾಸ)',
      dayPlan: 'ದಿನ {d}',
      photoLookup: 'ಚಿತ್ರದಿಂದ ಗುರುತಿಸಿ', photoMatch: 'ಚಿತ್ರ ಹೊಂದಾಣಿಕೆ', quickIdentify: 'ಅಥವಾ ಪ್ರಮುಖ ಲಕ್ಷಣದಿಂದ ಗುರುತಿಸಿ', uploadOrSnap: 'ಚಿತ್ರ ಅಪ್‌ಲೋಡ್ / ಕ್ಯಾಮೆರಾ',
      audiobook: 'ಆಡಿಯೋ ಗೈಡ್ ಮತ್ತು ಕಥೆ', briefAudio: '⚡ ಸಂಕ್ಷಿಪ್ತ ಆಡಿಯೋ', fullAudio: '📖 ಸಂಪೂರ್ಣ ಆಡಿಯೋಬುಕ್',
      playBrief: 'ಸಂಕ್ಷಿಪ್ತ ಆಡಿಯೋ ಕೇಳಿ', playFull: 'ಸಂಪೂರ್ಣ ಆಡಿಯೋಬುಕ್ ಕೇಳಿ', pause: 'ವಿರಾಮ', resume: 'ಮುಂದುವರಿಸಿ', replay: 'ಮತ್ತೆ ಕೇಳಿ',
      playing: 'ಆಡಿಯೋ ಪ್ಲೇ ಆಗುತ್ತಿದೆ...', paused: 'ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ', audioReady: 'ಕೇಳಲು ಪ್ಲೇ ಒತ್ತಿರಿ',
      scannedQr: '📍 ಫಲಕದಿಂದ ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗಿದೆ', voiceSiri: 'ಸಿರಿ / ನ್ಯಾಚುರಲ್ ಧ್ವನಿ'
    },
    hi: {
      tagline: 'हर स्मारक। हर तथ्य के साथ स्रोत।',
      tabMap: 'नक्शा', tabPlaces: 'स्थल', tabGuide: 'गाइड', tabPlan: 'योजना', tabSigns: 'साइनबोर्ड',
      setLoc: 'नक्शे पर मेरी जगह चुनें', useGps: 'GPS चलाएँ', tapNow: 'अब नक्शे पर टैप करें',
      nearYou: 'आपके सबसे पास', away: 'दूर',
      seen: 'देख लिया', markSeen: 'देखा हुआ चिह्नित करें', listen: 'सुनें', stop: 'रोकें',
      seenCount: '{b} में से {a} स्मारक देख लिए',
      recorded: 'दर्ज तथ्य', tradition: 'लोककथा', uncertain: 'पक्का नहीं',
      source: 'स्रोत', tip: 'जाने से पहले', showMap: 'नक्शे पर दिखाएँ', printSign: 'साइनबोर्ड',
      factsEnglish: 'विस्तृत तथ्य अभी अंग्रेज़ी में हैं।',
      modeCheck: 'दावा जाँचें', modeAsk: 'सवाल पूछें', go: 'खोजें',
      hintCheck: 'गाइड ने जो बताया वह लिखें। ऐप उसे रिकॉर्ड से मिलाता है।',
      hintAsk: 'किसी भी स्मारक के बारे में पूछें। रिकॉर्ड में जवाब न हो तो ऐप साफ़ बता देता है।',
      phCheck: 'e.g. The musical pillars are hollow', phAsk: 'e.g. How tall is the Narasimha statue?',
      englishOnly: 'सवाल अभी केवल अंग्रेज़ी में।',
      startFrom: 'शुरुआत', timeAvail: 'आपके पास समय', walk: 'पैदल', cycle: 'साइकिल', auto: 'ऑटो', bike: 'बाइक', car: 'कार',
      planBtn: 'मेरी यात्रा बनाएँ', myLoc: 'नक्शे पर मेरी जगह',
      planSum: '{t} में से {n} स्मारक, {h}, {k} किमी', skipped: 'इतने समय में नहीं हो पाएँगे', tapAdd: 'जो ज़रूर देखना है उस पर टैप करें। योजना बदल जाएगी।', resetMust: 'मेरी पसंद हटाएँ',
      atSite: 'मिनट यहाँ', arrive: 'पहुँचने का समय', overBudget: 'चुनी हुई जगहों के लिए ज़्यादा समय चाहिए।', planNote: 'समय और दूरी केवल अनुमान हैं। यह रास्ता बताने वाला नक्शा नहीं है।', noRecord: 'कोई रिकॉर्ड नहीं',
      signsTitle: 'हर स्मारक के लिए एक साइनबोर्ड',
      signsText: 'हम्पी में साइनबोर्ड बहुत कम हैं। हर बोर्ड पर QR कोड है। स्कैन करते ही उस स्मारक की जानकारी खुल जाती है।',
      signsBtn: 'छापने योग्य साइनबोर्ड खोलें', error: 'कुछ गड़बड़ हुई। क्या सर्वर चल रहा है?',
      needsInternet: 'इंटरनेट चाहिए',
      nearbyTitle: 'आस-पास ठहरने, खाने और पानी की जगहें',
      stayTonight: 'आज रात कहाँ ठहरें (आखिरी जगह के पास)',
      findNearby: 'यहाँ आस-पास की जगहें खोजें',
      nearbyNote: 'OpenStreetMap से सीधी जानकारी। हमने इसकी जाँच नहीं की है: जाने से पहले फ़ोन करके पुष्टि कर लें।',
      nearbyNone: 'यहाँ पास में OpenStreetMap पर कुछ नहीं मिला। ऊपर के Google Maps लिंक आज़माएँ।',
      nearbyFail: 'अभी सीधी जानकारी नहीं मिल पाई। ऊपर के Google Maps लिंक काम करते हैं।',
      k_stay: 'ठहरने की जगह',
      k_food: 'खाना',
      k_water: 'पीने का पानी',
      k_toilet: 'शौचालय',
      k_atm: 'एटीएम / बैंक',
      k_shop: 'दुकानें',
      stayNear: 'आज रात यहीं पास में ठहरें',
      grpHours: 'घंटे', grpDays: 'दिन / यात्रा',
      h2: '2 घंटे', h4: '4 घंटे', h6: '6 घंटे', h8: '8 घंटे',
      d1: '1 दिन (पूरा दिन)', d2: '2 दिन', d3: '3 दिन', w1: '1 सप्ताह (पूरी यात्रा)',
      dayPlan: 'दिन {d}',
      photoLookup: 'फ़ोटो से पहचानें', photoMatch: 'फ़ोटो मिलान', quickIdentify: 'या मुख्य विशेषता से पहचानें', uploadOrSnap: 'फ़ोटो अपलोड / कैमरा',
      audiobook: 'ऑडियो गाइड और कहानी', briefAudio: '⚡ संक्षिप्त ऑडियो', fullAudio: '📖 पूरी कहानी / ऑडियोबुक',
      playBrief: 'संक्षिप्त ऑडियो सुनें', playFull: 'पूरी ऑडियोबुक सुनें', pause: 'रोकें', resume: 'जारी रखें', replay: 'दोबारा सुनें',
      playing: 'ऑडियो चल रहा है...', paused: 'ऑडियो रोका गया', audioReady: 'सुनने के लिए प्ले दबाएं',
      scannedQr: '📍 साइनबोर्ड से स्कैन किया गया', voiceSiri: 'सिरी / नैचुरल वॉइस'
    },
    te: {
      tagline: 'ప్రతి స్మారకం. ప్రతి సమాచారానికి ఆధారాలు.',
      tabMap: 'మ్యాప్', tabPlaces: 'ప్రదేశాలు', tabGuide: 'గైడ్', tabPlan: 'ప్రణాళిక', tabSigns: 'బోర్డులు',
      setLoc: 'మ్యాప్‌పై నా స్థలాన్ని గుర్తించండి', useGps: 'GPS ఉపయోగించండి', tapNow: 'ఇప్పుడు మ్యాప్‌పై నొక్కండి',
      nearYou: 'మీకు అత్యంత సమీపంలో', away: 'దూరం',
      seen: 'చూశాను', markSeen: 'చూసినట్లు గుర్తించండి', listen: 'వినండి', stop: 'ఆపండి',
      seenCount: '{b} స్మారకాల్లో {a} చూశారు',
      recorded: 'రికార్డులో ఉన్నవి', tradition: 'గాథ', uncertain: 'ఖచ్చితంగా తెలియదు',
      source: 'మూలం', tip: 'వెళ్లే ముందు', showMap: 'మ్యాప్‌లో చూపించు', printSign: 'బోర్డు',
      factsEnglish: 'వివరణాత్మక వాస్తవాలు ప్రస్తుతానికి ఆంగ్లంలో ఉన్నాయి.',
      modeCheck: 'దావాను తనిఖీ చేయండి', modeAsk: 'ప్రశ్న అడగండి', go: 'వెతకండి',
      hintCheck: 'గైడ్ చెప్పినదాన్ని టైప్ చేయండి. యాప్ దానిని రికార్డుతో పోలుస్తుంది.',
      hintAsk: 'ఏదైనా స్మారకం గురించి అడగండి. రికార్డులో లేకపోతే యాప్ నేరుగా చెబుతుంది.',
      phCheck: 'e.g. The musical pillars are hollow', phAsk: 'e.g. How tall is the Narasimha statue?',
      englishOnly: 'ప్రశ్నలు ప్రస్తుతానికి ఆంగ్లంలో మాత్రమే.',
      startFrom: 'ప్రారంభ స్థలం', timeAvail: 'మీకున్న సమయం', walk: 'నడక', cycle: 'సైకిల్', auto: 'ఆటో', bike: 'బైక్', car: 'కారు',
      planBtn: 'నా ప్రయాణాన్ని ప్లాన్ చేయండి', myLoc: 'మ్యాప్‌పై నా స్థలం',
      planSum: '{t} స్మారకాల్లో {n}, {h}, {k} కి.మీ', skipped: 'ఈ సమయంలో సరిపోవు', tapAdd: 'తప్పక చూడవలసిన ప్రదేశంపై నొక్కండి. ప్రణాళిక మారుతుంది.', resetMust: 'నా ఎంపికలను తొలగించండి',
      atSite: 'నిమిషాలు ఇక్కడ', arrive: 'చేరుకునే సమయం', overBudget: 'మీరు ఎంచుకున్న ప్రదేశాలకు ఎక్కువ సమయం కావాలి.', planNote: 'సమయం మరియు దూరం అంచనాలు మాత్రమే. ఇది టర్న్-బై-టర్న్ దారి చూపించేది కాదు.', noRecord: 'రికార్డు లేదు',
      signsTitle: 'ప్రతి స్మారకానికి ఒక బోర్డు',
      signsText: 'హంపిలో బోర్డులు చాలా తక్కువ. ప్రతి ముద్రిత బోర్డులో QR కోడ్ ఉంటుంది. స్కాన్ చేస్తే ఆ స్మారకం వివరాలు తెరుచుకుంటాయి.',
      signsBtn: 'ముద్రించదగిన బోర్డులను తెరవండి', error: 'ఏదో లోపం జరిగింది. సర్వర్ నడుస్తోందా?',
      needsInternet: 'ఇంటర్నెట్ అవసరం',
      nearbyTitle: 'సమీపంలో బస, భోజనం మరియు నీరు',
      stayTonight: 'ఈ రాత్రి ఎక్కడ బస చేయాలి (చివరి ప్రదేశం దగ్గర)',
      findNearby: 'ఇక్కడ సమీప ప్రదేశాలను వెతకండి',
      nearbyNote: 'OpenStreetMap నుండి ప్రత్యక్ష సమాచారం. మేము తనిఖీ చేయలేదు: వెళ్లే ముందు ఫోన్ చేసి నిర్ధారించుకోండి.',
      nearbyNone: 'ఇక్కడ దగ్గరలో OpenStreetMap లో ఏమీ లేదు. పైన ఉన్న Google Maps లింక్‌లను ప్రయత్నించండి.',
      nearbyFail: 'ఇప్పుడు ప్రత్యక్ష సమాచారం రాలేదు. పైన ఉన్న Google Maps లింక్‌లు పనిచేస్తాయి.',
      k_stay: 'బస',
      k_food: 'భోజనం',
      k_water: 'తాగునీరు',
      k_toilet: 'మరుగుదొడ్లు',
      k_atm: 'ఏటీఎం / బ్యాంక్',
      k_shop: 'దుకాణాలు',
      stayNear: 'ఈ రాత్రి ఇక్కడ దగ్గర బస చేయండి',
      grpHours: 'గంటలు', grpDays: 'రోజులు / పర్యటన',
      h2: '2 గం', h4: '4 గం', h6: '6 గం', h8: '8 గం',
      d1: '1 రోజు (పూర్తి రోజు)', d2: '2 రోజులు', d3: '3 రోజులు', w1: '1 వారం (పూర్తి పర్యటన)',
      dayPlan: 'రోజు {d}',
      photoLookup: 'ఫోటో ద్వారా గుర్తించండి', photoMatch: 'ఫోటో సరిపోలింది', quickIdentify: 'లేదా ముఖ్య లక్షణం ద్వారా గుర్తించండి', uploadOrSnap: 'ఫోటో అప్‌లోడ్ / కెమెరా',
      audiobook: 'ఆడియో గైడ్ & కథ', briefAudio: '⚡ సంక్షిప్త ఆడియో', fullAudio: '📖 పూర్తి కథ / ఆడియోబుక్',
      playBrief: 'సంక్షిప్త ఆడియో వినండి', playFull: 'పూర్తి ఆడియోబుక్ వినండి', pause: 'పాజ్', resume: 'పునఃప్రారంభించు', replay: 'మళ్లీ వినండి',
      playing: 'ఆడియో ప్లే అవుతోంది...', paused: 'ఆడియో పాజ్ చేయబడింది', audioReady: 'వినడానికి ప్లే నొక్కండి',
      scannedQr: '📍 బోర్డు నుండి స్కాన్ చేయబడింది', voiceSiri: 'సిరి / న్యాచురల్ వాయిస్'
    }
  };

  var SAMPLES = {
    check: ['The musical pillars are hollow', 'The stone chariot is carved from a single rock',
      'Hampi was destroyed by the Mughals', 'Lotus Mahal was the queen\'s palace',
      'Krishnadevaraya built the Virupaksha temple'],
    ask: ['How tall is the Narasimha statue?', 'Who built the Krishna temple and why?',
      'What is the stone chariot?', 'When was the stepped tank found?', 'Who won the IPL in 2020?']
  };
  var SPEECH_LANG = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN', te: 'te-IN' };
  var TE_NAMES = {
    virupaksha: "విరూపాక్ష దేవాలయం", hemakuta: "హేమకూట కొండ దేవాలయాలు",
    sasivekalu: "సాసివెకాలు గణేశ", kadalekalu: "కడలేకాలు గణేశ",
    krishna: "కృష్ణ దేవాలయం", narasimha: "లక్ష్మీ నరసింహ మరియు బడవలింగ",
    underground: "భూగర్భ శివ దేవాలయం", hazararama: "హజార రామ దేవాలయం",
    lotusmahal: "లోటస్ మహల్", elephantstables: "ఏనుగుల శాల",
    mahanavami: "మహానవమి దిబ్బ", steppedtank: "మెట్ల కోనేరు",
    queensbath: "రాణి స్నానవాటిక", achyutaraya: "అచ్యుతరాయ దేవాలయం",
    matanga: "మాతంగ కొండ", bull: "ఏకశిలా నంది",
    kingsbalance: "రాజు తులాభారం", vittala: "విజయ విఠల దేవాలయం"
  };

  // ---------- state ----------
  var sites = [], starts = {}, byId = {};
  var lang = load('lang', 'en');
  var seen = load('seen', {});
  var largeText = load('large-text', false);
  var guideMode = 'check', planMode = 'walk', must = [];
  var offline = false;
  var map, markers = {}, youMarker = null, you = null, picking = false, routeLayer = null;

  function load(key, fallback) {
    try { var v = localStorage.getItem('hd-' + key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem('hd-' + key, JSON.stringify(value)); } catch (e) { /* private mode */ }
  }
  function $(id) { return document.getElementById(id); }
  function t(key, vars) {
    var s = (T[lang] && T[lang][key]) || T.en[key] || key;
    for (var k in (vars || {})) s = s.replace('{' + k + '}', vars[k]);
    return s;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function name(s) { return (lang === 'te' && s && s.id && TE_NAMES[s.id]) || (s && s.name && (s.name[lang] || s.name.en)) || ''; }
  function hm(min) {
    var h = Math.floor(min / 60), m = Math.round(min % 60);
    return (h ? h + ' h ' : '') + (m || !h ? m + ' min' : '');
  }
  function km(a, b) {
    var R = 6371, r = Math.PI / 180;
    var dp = (b.lat - a.lat) * r, dl = (b.lon - a.lon) * r;
    var h = Math.pow(Math.sin(dp / 2), 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.pow(Math.sin(dl / 2), 2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function compass(a, b) {
    var r = Math.PI / 180;
    var y = Math.sin((b.lon - a.lon) * r) * Math.cos(b.lat * r);
    var x = Math.cos(a.lat * r) * Math.sin(b.lat * r) - Math.sin(a.lat * r) * Math.cos(b.lat * r) * Math.cos((b.lon - a.lon) * r);
    var deg = (Math.atan2(y, x) / r + 360) % 360;
    return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8];
  }
  function getJSON(url, options) {
    return fetch(url, options).then(function (r) { return r.json(); });
  }

  // ---------- language ----------
  function applyLargeText() {
    document.body.classList.toggle('large-text', !!largeText);
    var btn = $('textToggle');
    if (btn) btn.classList.toggle('on', !!largeText);
  }
  function toggleLargeText() {
    largeText = !largeText;
    save('large-text', largeText);
    try { localStorage.setItem('large-text', JSON.stringify(largeText)); } catch (e) {}
    applyLargeText();
  }
  applyLargeText();
  function applyLang() {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = t(el.dataset.t); });
    document.querySelectorAll('[data-label-t]').forEach(function (el) { el.label = t(el.dataset.labelT); });
    document.querySelectorAll('[data-t-val]').forEach(function (el) { el.textContent = t(el.dataset.tVal); });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
    renderList(); renderGuideMode(); renderStarts(); refreshMarkers(); renderNear();
  }

  // ---------- tabs ----------
  function showTab(tab) {
    if (typeof stopAudio === 'function') stopAudio();
    if (tab === 'map' && window.innerWidth >= 900) tab = 'places';
    document.body.dataset.tab = tab;
    document.querySelectorAll('.tabs button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.tab === tab);
    });
    ['places', 'guide', 'plan', 'signs'].forEach(function (id) { $(id).hidden = id !== tab; });
    if (map) setTimeout(function () { map.invalidateSize(); }, 60);
  }

  // ---------- map ----------
  function initMap() {
    map = L.map('map', { zoomControl: true, attributionControl: true }).setView([15.327, 76.467], 14);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18, attribution: '&copy; OpenStreetMap contributors'
    }).on('tileerror', function () {
      // No internet for map tiles: keep the pins and show their names instead.
      if (!offline) setOffline(true);
    }).addTo(map);
    sites.forEach(function (s) {
      markers[s.id] = L.marker([s.lat, s.lon], { icon: pin(s) }).addTo(map)
        .on('click', function () { openSite(s.id); });
    });
    map.on('click', function (e) {
      if (!picking) return;
      picking = false;
      $('locBtn').textContent = t('setLoc');
      $('locBtn').classList.remove('on');
      setYou({ lat: e.latlng.lat, lon: e.latlng.lng });
    });
  }
  function pin(s, number) {
    var cls = 'pin' + (seen[s.id] ? ' seen' : '') + (number ? ' num' : '');
    return L.divIcon({
      className: '', iconSize: [30, 30], iconAnchor: [15, 15],
      html: '<div class="' + cls + '" title="' + esc(name(s)) + '">' + (number || (seen[s.id] ? '&#10003;' : '')) + '</div>'
    });
  }
  function refreshMarkers() {
    if (!map) return;
    sites.forEach(function (s) {
      markers[s.id].setIcon(pin(s));
      markers[s.id].unbindTooltip();
      markers[s.id].bindTooltip(name(s), {
        direction: 'right', offset: [14, 0], className: 'pin-label',
        permanent: offline && s.priority >= 4
      });
    });
  }
  function setYou(point) {
    you = point;
    if (youMarker) youMarker.remove();
    youMarker = L.marker([you.lat, you.lon], {
      icon: L.divIcon({ className: '', iconSize: [22, 22], iconAnchor: [11, 11], html: '<div class="you"></div>' })
    }).addTo(map);
    renderNear(); renderStarts(true);
  }
  function renderNear() {
    var box = $('nearBox');
    if (!you) { box.hidden = true; return; }
    var list = sites.map(function (s) { return { s: s, d: km(you, s) }; })
      .sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
    box.hidden = false;
    box.innerHTML = '<b>' + esc(t('nearYou')) + '</b>' + list.map(function (x) {
      var dist = x.d < 1 ? Math.round(x.d * 1000) + ' m' : x.d.toFixed(1) + ' km';
      return '<button data-site="' + x.s.id + '"><span>' + esc(name(x.s)) + '</span><i>' +
        dist + ' ' + compass(you, x.s) + '</i></button>';
    }).join('');
  }

  // ---------- places list ----------
  function renderList() {
    var done = sites.filter(function (s) { return seen[s.id]; }).length;
    $('seenCount').textContent = t('seenCount', { a: done, b: sites.length });
    $('seenBar').style.width = (sites.length ? done / sites.length * 100 : 0) + '%';
    var zones = {};
    sites.forEach(function (s) { (zones[s.zone] = zones[s.zone] || []).push(s); });
    $('siteList').innerHTML = Object.keys(zones).map(function (z) {
      return '<li class="zone">' + esc(z) + '</li>' + zones[z].map(function (s) {
        return '<li><button class="site-row' + (seen[s.id] ? ' seen' : '') + '" data-site="' + s.id + '">' +
          '<span class="dot">' + (seen[s.id] ? '&#10003;' : '') + '</span>' +
          '<span class="site-text"><b>' + esc(name(s)) + '</b><small>' + esc(s.summary[lang] || s.summary.en) + '</small></span>' +
          '<span class="mins">' + s.visit_min + ' min</span></button></li>';
      }).join('');
    }).join('');
  }

  // ---------- audiobook & audio guide ----------
  var cachedVoices = [];
  function loadVoices() {
    if (window.speechSynthesis) cachedVoices = speechSynthesis.getVoices() || [];
  }
  if (window.speechSynthesis) {
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = function () {
        loadVoices();
        var vEl = $('abVoiceName');
        if (vEl) vEl.textContent = getVoiceLabel(getBestVoice(lang));
      };
    }
  }

  function getBestVoice(targetLang) {
    if (!window.speechSynthesis) return null;
    var voices = cachedVoices.length ? cachedVoices : (speechSynthesis.getVoices() || []);
    if (!voices || !voices.length) return null;

    var prefLang = (SPEECH_LANG[targetLang] || 'en-IN').toLowerCase();
    var langPrefix = prefLang.split('-')[0];

    function score(v) {
      var pts = 0;
      var n = (v.name || '').toLowerCase();
      var vl = (v.lang || '').toLowerCase();

      if (n.indexOf('siri') !== -1) pts += 1200;
      if (n.indexOf('samantha') !== -1) pts += 900;
      if (n.indexOf('natural') !== -1 || n.indexOf('neural') !== -1) pts += 850;
      if (n.indexOf('aria') !== -1) pts += 800;
      if (n.indexOf('jenny') !== -1 || n.indexOf('guy') !== -1) pts += 750;
      if (n.indexOf('google') !== -1) pts += 600;
      if (n.indexOf('karen') !== -1 || n.indexOf('victoria') !== -1 || n.indexOf('daniel') !== -1) pts += 550;

      if (vl === prefLang) pts += 250;
      else if (vl.indexOf(langPrefix) === 0) pts += 180;
      else if (vl.indexOf('en') === 0) pts += 50;

      return pts;
    }

    var sorted = voices.slice().sort(function (a, b) { return score(b) - score(a); });
    return sorted[0] || null;
  }

  function getVoiceLabel(voice) {
    if (!voice) return t('voiceSiri');
    var n = voice.name;
    if (/siri/i.test(n)) return 'Apple Siri Voice';
    if (/samantha/i.test(n)) return 'Siri Voice (Samantha)';
    if (/natural|neural/i.test(n)) return 'Natural Neural Voice';
    if (/aria/i.test(n)) return 'Microsoft Natural (Aria)';
    if (/google/i.test(n)) return 'Google Natural Voice';
    return n.length > 22 ? n.substring(0, 20) + '…' : n;
  }

  function splitIntoSentences(text) {
    if (!text) return [];
    var m = text.match(/[^.!?\n]+[.!?]+(?:\s|$)|[^.!?\n]+$/g);
    return m ? m.map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; }) : [text.trim()];
  }

  function buildAudiobookNarrative(site, isFull, targetLang) {
    var siteName = name(site);
    var sum = site.summary[targetLang] || site.summary.en;
    var tip = site.tip || '';

    if (!isFull) {
      if (targetLang === 'kn') {
        return [
          siteName + ' ಗೆ ಸುಸ್ವಾಗತ. ಇದು ಹಂಪಿಯ ' + site.zone + ' ನಲ್ಲಿದೆ.',
          sum,
          tip ? 'ಸಂದರ್ಶಕರ ಗಮನಕ್ಕೆ: ' + tip : ''
        ].filter(Boolean);
      } else if (targetLang === 'hi') {
        return [
          siteName + ' में आपका स्वागत है। यह हम्पी के ' + site.zone + ' में स्थित है।',
          sum,
          tip ? 'पर्यटकों के लिए सुझाव: ' + tip : ''
        ].filter(Boolean);
      } else if (targetLang === 'te') {
        return [
          siteName + ' కు స్వాగతం. ఇది హంపి ' + site.zone + ' లో ఉంది.',
          sum,
          tip ? 'సందర్శకులకు చిట్కా: ' + tip : ''
        ].filter(Boolean);
      } else {
        return [
          'Welcome to ' + siteName + ', located in the ' + site.zone + ' of Hampi.',
          sum,
          tip ? 'Visitor tip: ' + tip : ''
        ].filter(Boolean);
      }
    }

    var narrative = [];
    var recorded = (site.facts || []).filter(function (f) { return f.kind === 'recorded'; }).map(function (f) { return f.text; });
    var tradition = (site.facts || []).filter(function (f) { return f.kind === 'tradition'; }).map(function (f) { return f.text; });
    var uncertain = (site.facts || []).filter(function (f) { return f.kind === 'uncertain'; }).map(function (f) { return f.text; });

    narrative.push('Welcome to the complete audiobook of ' + siteName + ', situated in the historic ' + site.zone + ' of Hampi.');
    narrative.push(sum);

    if (recorded.length) {
      narrative.push('Chapter one: History and Architecture.');
      recorded.forEach(function (f) { narrative.push(f); });
    }
    if (tradition.length) {
      narrative.push('Chapter two: Legends and Living Traditions.');
      tradition.forEach(function (f) { narrative.push(f); });
    }
    if (uncertain.length) {
      narrative.push('Chapter three: Mysteries and Uncertainties.');
      uncertain.forEach(function (f) { narrative.push(f); });
    }
    if (tip) {
      narrative.push('Visitor Advisory: ' + tip);
    }
    narrative.push('Thank you for exploring with the Hampi Daari audio guide.');

    return narrative;
  }

  var audioGuide = {
    currentSiteId: null,
    mode: 'brief',
    sentences: [],
    sentenceIndex: 0,
    isPlaying: false,
    isPaused: false
  };

  function initAudioForSite(siteId, preferredMode) {
    var mode = preferredMode || audioGuide.mode || 'brief';
    audioGuide.currentSiteId = siteId;
    audioGuide.mode = mode;
    audioGuide.isPlaying = false;
    audioGuide.isPaused = false;
    audioGuide.sentenceIndex = 0;
    var s = byId[siteId];
    if (s) {
      var raw = buildAudiobookNarrative(s, mode === 'full', lang);
      var all = [];
      raw.forEach(function (r) { all = all.concat(splitIntoSentences(r)); });
      audioGuide.sentences = all;
    } else {
      audioGuide.sentences = [];
    }
  }

  function playSentence(index) {
    if (!window.speechSynthesis) return;
    if (!audioGuide.isPlaying || audioGuide.isPaused) return;

    if (index >= audioGuide.sentences.length) {
      audioGuide.isPlaying = false;
      audioGuide.isPaused = false;
      audioGuide.sentenceIndex = audioGuide.sentences.length;
      updateAudioUI();
      return;
    }

    audioGuide.sentenceIndex = index;
    updateAudioUI();

    var sText = audioGuide.sentences[index];
    var u = new SpeechSynthesisUtterance(sText);
    var voice = getBestVoice(lang);
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    } else {
      u.lang = SPEECH_LANG[lang] || 'en-IN';
    }
    u.rate = 0.95;
    u.pitch = 1.02;

    u.onend = function () {
      if (audioGuide.isPlaying && !audioGuide.isPaused) {
        playSentence(index + 1);
      }
    };
    u.onerror = function (e) {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      if (audioGuide.isPlaying && !audioGuide.isPaused) {
        playSentence(index + 1);
      }
    };

    speechSynthesis.speak(u);
  }

  function toggleAudio() {
    if (!window.speechSynthesis) return;
    if (audioGuide.isPlaying && !audioGuide.isPaused) {
      audioGuide.isPaused = true;
      speechSynthesis.cancel();
      updateAudioUI();
    } else if (audioGuide.isPaused) {
      audioGuide.isPaused = false;
      audioGuide.isPlaying = true;
      playSentence(audioGuide.sentenceIndex);
    } else {
      speechSynthesis.cancel();
      audioGuide.isPlaying = true;
      audioGuide.isPaused = false;
      if (audioGuide.sentenceIndex >= audioGuide.sentences.length) {
        audioGuide.sentenceIndex = 0;
      }
      playSentence(audioGuide.sentenceIndex);
    }
  }

  function setAudioMode(newMode) {
    if (audioGuide.mode === newMode) return;
    stopAudio();
    initAudioForSite(audioGuide.currentSiteId, newMode);
    updateAudioUI();
  }

  function stopAudio() {
    audioGuide.isPlaying = false;
    audioGuide.isPaused = false;
    audioGuide.sentenceIndex = 0;
    if (window.speechSynthesis) speechSynthesis.cancel();
    updateAudioUI();
  }

  function updateAudioUI() {
    var card = $('abCard');
    var playBtn = $('abPlayBtn');
    var statusEl = $('abStatus');
    var fill = $('abProgressFill');
    var briefBtn = $('abModeBrief');
    var fullBtn = $('abModeFull');
    var speakBtn = $('speakBtn');
    var voiceEl = $('abVoiceName');

    if (card) {
      card.classList.toggle('is-playing', audioGuide.isPlaying && !audioGuide.isPaused);
    }
    if (briefBtn && fullBtn) {
      briefBtn.classList.toggle('on', audioGuide.mode === 'brief');
      fullBtn.classList.toggle('on', audioGuide.mode === 'full');
    }
    if (voiceEl) {
      voiceEl.textContent = getVoiceLabel(getBestVoice(lang));
    }

    var total = Math.max(1, audioGuide.sentences.length);
    var pct = Math.min(100, Math.round((audioGuide.sentenceIndex / total) * 100));

    if (fill) {
      fill.style.width = (audioGuide.isPlaying && audioGuide.sentenceIndex === 0 ? 5 : pct) + '%';
    }

    if (audioGuide.isPlaying && !audioGuide.isPaused) {
      if (playBtn) playBtn.innerHTML = '<span class="ab-play-icon">⏸</span> <span>' + esc(t('pause')) + '</span>';
      if (statusEl) statusEl.textContent = t('playing') + ' (' + (audioGuide.sentenceIndex + 1) + '/' + total + ')';
      if (speakBtn) speakBtn.textContent = t('pause');
    } else if (audioGuide.isPaused) {
      if (playBtn) playBtn.innerHTML = '<span class="ab-play-icon">▶</span> <span>' + esc(t('resume')) + '</span>';
      if (statusEl) statusEl.textContent = t('paused') + ' (' + (audioGuide.sentenceIndex + 1) + '/' + total + ')';
      if (speakBtn) speakBtn.textContent = t('resume');
    } else if (audioGuide.sentenceIndex >= audioGuide.sentences.length && audioGuide.sentences.length > 0) {
      if (playBtn) playBtn.innerHTML = '<span class="ab-play-icon">↺</span> <span>' + esc(t('replay')) + '</span>';
      if (statusEl) statusEl.textContent = t('seen') + ' (100%)';
      if (speakBtn) speakBtn.textContent = t('listen');
    } else {
      var label = audioGuide.mode === 'full' ? t('playFull') : t('playBrief');
      if (playBtn) playBtn.innerHTML = '<span class="ab-play-icon">▶</span> <span>' + esc(label) + '</span>';
      if (statusEl) statusEl.textContent = t('audioReady');
      if (speakBtn) speakBtn.textContent = t('listen');
    }
  }

  // ---------- monument sheet ----------
  function factHTML(f) {
    return '<li class="fact ' + f.kind + '"><span class="tag">' + esc(t(f.kind)) + '</span>' +
      '<p>' + esc(f.text) + '</p><small>' + esc(t('source')) + ': ' + esc(f.source) +
      (f.site_name ? ' &middot; ' + esc(f.site_name) : '') + '</small></li>';
  }
  function openSite(id) {
    var s = byId[id];
    if (!s) return;
    stopAudio();
    initAudioForSite(id, 'brief');

    var isFromQR = location.hash === '#site/' + id;
    var summary = s.summary[lang] || s.summary.en;
    var bestVoice = getBestVoice(lang);
    var voiceName = getVoiceLabel(bestVoice);

    $('sheetBody').innerHTML =
      '<div class="zone-tag">' + esc(s.zone) + '</div>' +
      '<h2>' + esc(name(s)) + '</h2>' +
      (lang !== 'en' ? '<div class="alt-name">' + esc(s.name.en) + '</div>' : '') +
      '<p class="lead">' + esc(summary) + '</p>' +
      (isFromQR ? '<div class="ab-qr-pill">' + esc(t('scannedQr')) + '</div>' : '') +
      '<div class="audiobook-card" id="abCard">' +
        '<div class="ab-header">' +
          '<div class="ab-title">' +
            '<span class="ab-icon">🎧</span>' +
            '<div>' +
              '<div class="ab-heading">' + esc(t('audiobook')) + '</div>' +
              '<div class="ab-sub" id="abVoiceName">' + esc(voiceName) + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="ab-mode-pills">' +
            '<button type="button" class="ab-mode-btn on" id="abModeBrief">' + esc(t('briefAudio')) + '</button>' +
            '<button type="button" class="ab-mode-btn" id="abModeFull">' + esc(t('fullAudio')) + '</button>' +
          '</div>' +
        '</div>' +
        '<div class="ab-controls">' +
          '<button type="button" class="ab-play-btn" id="abPlayBtn">' +
            '<span class="ab-play-icon">▶</span> <span id="abPlayText">' + esc(t('playBrief')) + '</span>' +
          '</button>' +
          '<div class="ab-status-wrap">' +
            '<div class="ab-status" id="abStatus">' + esc(t('audioReady')) + '</div>' +
            '<div class="ab-progress-bar"><div class="ab-progress-fill" id="abProgressFill" style="width:0%"></div></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="actions">' +
      '<button class="btn" id="speakBtn">' + esc(t('listen')) + '</button>' +
      '<button class="btn ghost" id="seenBtn">' + esc(seen[id] ? t('seen') + ' ✓' : t('markSeen')) + '</button>' +
      '<button class="btn ghost" id="mapBtn">' + esc(t('showMap')) + '</button>' +
      '<a class="btn ghost" href="/sign/' + id + '">' + esc(t('printSign')) + '</a></div>' +
      '<div class="legend"><span class="tag recorded">' + esc(t('recorded')) + '</span>' +
      '<span class="tag tradition">' + esc(t('tradition')) + '</span>' +
      '<span class="tag uncertain">' + esc(t('uncertain')) + '</span></div>' +
      (lang !== 'en' ? '<p class="muted small">' + esc(t('factsEnglish')) + '</p>' : '') +
      '<ul class="facts">' + s.facts.map(factHTML).join('') + '</ul>' +
      '<div class="tipbox"><b>' + esc(t('tip')) + '</b> ' + esc(s.tip) + '</div>' +
      nearbyHTML('siteNearby', t('nearbyTitle'), s.lat, s.lon);

    $('sheet').hidden = false;

    $('seenBtn').onclick = function () {
      seen[id] = !seen[id]; save('seen', seen);
      renderList(); refreshMarkers(); openSite(id);
    };
    $('mapBtn').onclick = function () {
      closeSheet(); showTab('map'); map.setView([s.lat, s.lon], 17);
    };
    $('abPlayBtn').onclick = function () { toggleAudio(); };
    $('speakBtn').onclick = function () { toggleAudio(); };
    $('abModeBrief').onclick = function () { setAudioMode('brief'); };
    $('abModeFull').onclick = function () { setAudioMode('full'); };

    if (location.hash !== '#site/' + id) history.replaceState(null, '', '#site/' + id);
  }
  function closeSheet() {
    $('sheet').hidden = true;
    stopAudio();
    history.replaceState(null, '', location.pathname);
  }
  function speak(text, button) {
    toggleAudio();
  }

  // ---------- guide ----------
  function updateOfflineUI() {
    var segButtons = document.querySelectorAll('#guide .seg button');
    var goBtn = $('guideForm') ? $('guideForm').querySelector('button') : null;
    if (offline) {
      segButtons.forEach(function (b) { b.textContent = t('needsInternet'); });
      if (goBtn) goBtn.textContent = t('needsInternet');
    } else {
      segButtons.forEach(function (b) { b.textContent = t(b.dataset.mode === 'check' ? 'modeCheck' : 'modeAsk'); });
      if (goBtn) goBtn.textContent = t('go');
    }
  }
  function setOffline(isOff) {
    offline = isOff;
    refreshMarkers();
    updateOfflineUI();
  }
  function renderGuideMode() {
    document.querySelectorAll('#guide .seg button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.mode === guideMode);
    });
    $('guideHint').textContent = t(guideMode === 'check' ? 'hintCheck' : 'hintAsk');
    $('guideInput').placeholder = t(guideMode === 'check' ? 'phCheck' : 'phAsk');
    $('samples').innerHTML = SAMPLES[guideMode].map(function (q) {
      return '<button class="chip" data-q="' + esc(q) + '">' + esc(q) + '</button>';
    }).join('');
    updateOfflineUI();
  }
  function runGuide(q) {
    q = q.trim();
    if (!q) return;
    $('guideInput').value = q;
    $('guideOut').innerHTML = '<p class="muted">...</p>';
    getJSON('/api/' + guideMode + '?q=' + encodeURIComponent(q)).then(function (r) {
      if (r.error) { $('guideOut').innerHTML = '<p class="muted">' + esc(r.error) + '</p>'; return; }
      $('guideOut').innerHTML = guideMode === 'check' ? verdictHTML(r) : answerHTML(r);
    }).catch(function () {
      setOffline(true);
      $('guideOut').innerHTML = '<p class="muted">' + esc(t('error')) + '</p>';
    });
  }
  function verdictHTML(r) {
    var html = '<div class="verdict ' + r.verdict + '"><div class="stamp">' + esc(r.label) + '</div>' +
      '<p class="quoted">“' + esc(r.statement) + '”</p><p>' + esc(r.answer) + '</p>';
    if (r.matched) {
      html += '<small>' + (r.site ? '<a href="#site/' + r.site + '">' + esc(r.site_name) + ' &rarr;</a>' : esc(r.site_name)) + '</small>';
    }
    html += '</div>';
    if (r.related && r.related.length) html += '<ul class="facts">' + r.related.map(factHTML).join('') + '</ul>';
    return html;
  }
  function answerHTML(r) {
    if (!r.found) return '<div class="verdict unknown"><div class="stamp">' + esc(t('noRecord')) + '</div><p>' + esc(r.message) + '</p></div>';
    return '<ul class="facts">' + r.answers.map(factHTML).join('') + '</ul>';
  }

  // ---------- plan ----------
  function stars(rating) {
    if (!rating) return '';
    var full = Math.floor(rating);
    var half = (rating - full) >= 0.3 ? 1 : 0;
    var empty = 5 - full - half;
    var s = '';
    for (var i = 0; i < full; i++) s += '★';
    if (half) s += '½';
    for (var i = 0; i < empty; i++) s += '☆';
    return s;
  }
  function reviewCount(n) {
    if (!n) return '';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return '' + n;
  }
  function renderStarts(selectYou) {
    var sel = $('planStart'), current = selectYou ? 'you' : sel.value;
    sel.innerHTML = Object.keys(starts).map(function (k) {
      return '<option value="' + k + '">' + esc(starts[k].name) + '</option>';
    }).join('') + (you ? '<option value="you">' + esc(t('myLoc')) + '</option>' : '');
    if (current && sel.querySelector('option[value="' + current + '"]')) sel.value = current;
  }
  function runPlan() {
    var start = $('planStart').value;
    var body = {
      start: start === 'you' ? you : start,
      minutes: +$('planTime').value, mode: planMode, must: must
    };
    getJSON('/api/plan', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    }).then(drawPlan).catch(function () { $('planOut').innerHTML = '<p class="muted">' + esc(t('error')) + '</p>'; });
  }
  function drawPlan(p) {
    if (p.error) { $('planOut').innerHTML = '<p class="muted">' + esc(p.error) + '</p>'; return; }
    var html = '<div class="plan-sum">' + esc(t('planSum', {
      n: p.stops.length, t: p.total_sites, h: hm(p.minutes_used), k: p.distance_km
    })) + '</div>';
    if (must.length) html += '<button class="chip" data-must="">' + esc(t('resetMust')) + '</button>';
    html += '<p class="muted small">' + esc(t('planNote')) + '</p>';
    if (p.over_budget) html += '<p class="muted">' + esc(t('overBudget')) + '</p>';
    var isMultiDay = p.minutes_available >= 1200;
    var daysCount = p.minutes_available >= 4200 ? 7 : (p.minutes_available >= 1800 ? 3 : 2);
    var perDay = isMultiDay ? Math.ceil(p.stops.length / Math.min(daysCount, Math.max(1, p.stops.length))) : 0;
    html += '<ol class="stops"><li class="start">' + esc(p.start.name) + '</li>';
    p.stops.forEach(function (s, i) {
      if (isMultiDay && i % perDay === 0) {
        var dayNum = Math.floor(i / perDay) + 1;
        html += '<li class="day-divider">' + esc(t('dayPlan', { d: dayNum })) + '</li>';
      }
      html += '<li><button data-site="' + s.id + '"><span class="n">' + (i + 1) + '</span>' +
        '<span class="site-text"><b>' + esc(name(s)) + '</b>' +
        (s.rating ? '<span class="rating"><span class="stars">' + stars(s.rating) + '</span> ' + s.rating + '<span class="review-count">(' + reviewCount(s.reviews) + ')</span></span>' : '') +
        '<small>+' + hm(s.arrive_min) + ' &middot; ' + s.leg_km + ' km &middot; ' + s.visit_min + ' ' + esc(t('atSite')) + '</small></span></button></li>';
      if (isMultiDay && ((i + 1) % perDay === 0 || i === p.stops.length - 1)) {
        html += '<li class="day-stay"><span>' + esc(t('stayNear')) + '</span> ' +
          '<a class="chip" target="_blank" rel="noopener" href="' + mapsLink('stay', s.lat, s.lon) + '">' + esc(t('k_stay')) + ' &#8599;</a> ' +
          '<a class="chip" target="_blank" rel="noopener" href="' + mapsLink('food', s.lat, s.lon) + '">' + esc(t('k_food')) + ' &#8599;</a></li>';
      }
    });
    html += '</ol>';
    if (p.skipped.length) {
      html += '<div class="skipped"><b>' + esc(t('skipped')) + '</b><small>' + esc(t('tapAdd')) + '</small><div>' +
        p.skipped.map(function (s) {
          return '<button class="chip" data-must="' + s.id + '">+ ' + esc(name(s)) +
            (s.rating ? ' <span class="chip-rating">' + s.rating + '★</span>' : '') + '</button>';
        }).join('') + '</div></div>';
    }
    if (p.stops.length) {
      var last = p.stops[p.stops.length - 1];
      html += nearbyHTML('planNearby', t('stayTonight'), last.lat, last.lon);
    }
    $('planOut').innerHTML = html;

    if (routeLayer) routeLayer.remove();
    refreshMarkers();
    var line = [[p.start.lat, p.start.lon]].concat(p.stops.map(function (s) { return [s.lat, s.lon]; }));
    routeLayer = L.polyline(line, { color: '#b5651d', weight: 4, opacity: 0.85, dashArray: '2 8', lineCap: 'round' }).addTo(map);
    p.stops.forEach(function (s, i) { markers[s.id].setIcon(pin(byId[s.id], i + 1)); });
    if (line.length > 1) map.fitBounds(routeLayer.getBounds(), { padding: [30, 30] });
  }

  // ---------- stays, food and water nearby (live OpenStreetMap data) ----------
  var NEAR_KINDS = ['stay', 'food', 'water', 'toilet', 'atm', 'shop'];
  var NEAR_SEARCH = { stay: 'hotels', food: 'restaurants', water: 'drinking water', toilet: 'public toilets', atm: 'ATM', shop: 'shops' };
  var NEAR_COLOR = { stay: '#7b3f99', food: '#c0392b', water: '#2471a3', toilet: '#566573', atm: '#1e8449', shop: '#b7950b' };
  var nearbyLayer = null;

  function mapsLink(kind, lat, lon) {
    return 'https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(NEAR_SEARCH[kind] + ' near ' + lat.toFixed(5) + ',' + lon.toFixed(5));
  }
  function nearbyHTML(boxId, title, lat, lon) {
    return '<div class="nearby"><h3>' + esc(title) + '</h3>' +
      '<div class="near-links">' + NEAR_KINDS.map(function (k) {
        return '<a class="chip" target="_blank" rel="noopener" href="' + mapsLink(k, lat, lon) + '">' + esc(t('k_' + k)) + ' &#8599;</a>';
      }).join('') + '</div>' +
      '<button class="btn ghost" data-nearby="' + lat + ',' + lon + '" data-box="' + boxId + '">' + esc(t('findNearby')) + '</button>' +
      '<div id="' + boxId + '" class="near-out"></div></div>';
  }
  function metres(m) { return m < 1000 ? m + ' m' : (m / 1000).toFixed(1) + ' km'; }
  function showNearbyOnMap(places) {
    if (!nearbyLayer) nearbyLayer = L.layerGroup().addTo(map);
    nearbyLayer.clearLayers();
    places.forEach(function (p) {
      L.circleMarker([p.lat, p.lon], { radius: 7, color: '#fff', weight: 2, fillColor: NEAR_COLOR[p.kind], fillOpacity: 0.95 })
        .bindPopup('<b>' + esc(p.name || t('k_' + p.kind)) + '</b><br>' + esc(t('k_' + p.kind)) + ' &middot; ' + metres(p.distance_m))
        .addTo(nearbyLayer);
    });
  }
  function loadNearby(lat, lon, box) {
    if (!box) return;
    box.innerHTML = '<p class="muted small">...</p>';
    getJSON('/api/nearby?lat=' + lat + '&lon=' + lon).then(function (r) {
      if (r.error || !r.live) { box.innerHTML = '<p class="muted small">' + esc(t('nearbyFail')) + '</p>'; return; }
      if (!r.places.length) { box.innerHTML = '<p class="muted small">' + esc(t('nearbyNone')) + '</p>'; return; }
      showNearbyOnMap(r.places);
      var html = '';
      NEAR_KINDS.forEach(function (k) {
        var list = r.places.filter(function (p) { return p.kind === k; });
        if (!list.length) return;
        html += '<div class="near-group"><b><span class="dot" style="background:' + NEAR_COLOR[k] + '"></span>' + esc(t('k_' + k)) + '</b><ul>' +
          list.map(function (p) {
            return '<li><button class="near-place" data-place="' + p.lat + ',' + p.lon + '">' + esc(p.name || t('k_' + k)) +
              ' <small class="muted">' + metres(p.distance_m) + '</small></button>' +
              (p.phone ? ' <a class="small" href="tel:' + esc(p.phone.replace(/\s/g, '')) + '">' + esc(p.phone) + '</a>' : '') + '</li>';
          }).join('') + '</ul></div>';
      });
      box.innerHTML = html + '<p class="muted small">' + esc(t('nearbyNote')) + '</p>';
    }).catch(function () {
      box.innerHTML = '<p class="muted small">' + esc(t('nearbyFail')) + '</p>';
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-nearby]');
    if (b) {
      var c = b.dataset.nearby.split(',');
      loadNearby(+c[0], +c[1], $(b.dataset.box));
      return;
    }
    var pl = e.target.closest('[data-place]');
    if (pl) {
      var q = pl.dataset.place.split(',');
      if (!$('sheet').hidden) closeSheet();
      showTab('map');
      map.setView([+q[0], +q[1]], 17);
    }
  });

  // ---------- wiring ----------
  function fromHash() {
    var m = location.hash.match(/^#site\/([\w-]+)/);
    if (m) openSite(m[1]);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('#textToggle');
    if (el) { toggleLargeText(); return; }
    el = e.target.closest('[data-sample]');
    if (el) { identifyPhoto(el.dataset.sample); return; }
    el = e.target.closest('[data-site]');
    if (el) { openSite(el.dataset.site); return; }
    el = e.target.closest('[data-q]');
    if (el) { runGuide(el.dataset.q); return; }
    el = e.target.closest('[data-must]');
    if (el) { must = el.dataset.must ? must.concat(el.dataset.must) : []; runPlan(); return; }
    el = e.target.closest('.tabs button');
    if (el) { showTab(el.dataset.tab); return; }
    el = e.target.closest('.lang button');
    if (el) { lang = el.dataset.lang; save('lang', lang); applyLang(); return; }
    el = e.target.closest('#guide .seg button');
    if (el) { guideMode = el.dataset.mode; $('guideOut').innerHTML = ''; $('guideInput').value = ''; renderGuideMode(); return; }
    el = e.target.closest('#planMode button');
    if (el) {
      planMode = el.dataset.mode;
      document.querySelectorAll('#planMode button').forEach(function (b) { b.classList.toggle('on', b === el); });
      return;
    }
    if (e.target.id === 'sheet' || e.target.id === 'sheetClose') closeSheet();
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !$('sheet').hidden) closeSheet(); });
  $('guideForm').addEventListener('submit', function (e) { e.preventDefault(); runGuide($('guideInput').value); });

  // Voice input using speech recognition
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var micBtn = document.createElement('button');
  micBtn.type = 'button';
  micBtn.id = 'micBtn';
  micBtn.className = 'btn ghost mic-btn';
  micBtn.setAttribute('aria-label', 'Voice input');
  micBtn.textContent = '🎤';
  if (!Recognition) {
    micBtn.hidden = true;
  } else {
    var recog = new Recognition();
    recog.onresult = function (event) {
      if (event.results && event.results[0]) {
        $('guideInput').value = event.results[0][0].transcript;
      }
    };
    micBtn.addEventListener('click', function () {
      recog.lang = SPEECH_LANG[lang] || 'en-IN';
      try { recog.start(); } catch (err) { /* already started */ }
    });
  }
  var gi = $('guideInput');
  if (gi && gi.parentNode) gi.parentNode.insertBefore(micBtn, gi.nextSibling);

  // Photo lookup
  var camBtn = document.createElement('button');
  camBtn.type = 'button';
  camBtn.id = 'camBtn';
  camBtn.className = 'btn ghost cam-btn';
  camBtn.setAttribute('aria-label', t('photoLookup'));
  camBtn.setAttribute('title', t('photoLookup'));
  camBtn.textContent = '📷';

  var photoInput = document.createElement('input');
  photoInput.type = 'file';
  photoInput.id = 'photoInput';
  photoInput.accept = 'image/*';
  photoInput.setAttribute('capture', 'environment');
  photoInput.style.display = 'none';

  if (gi && gi.parentNode) {
    gi.parentNode.insertBefore(camBtn, micBtn ? micBtn.nextSibling : gi.nextSibling);
    gi.parentNode.appendChild(photoInput);
  }

  camBtn.addEventListener('click', function () { showPhotoPanel(); });
  photoInput.addEventListener('change', function () {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) { identifyPhoto(e.target.result); };
      reader.readAsDataURL(this.files[0]);
    }
  });

  function showPhotoPanel() {
    var samples = [
      { id: 'vittala', name: 'Vijaya Vittala (Stone Chariot)', file: '/static/samples/vittala.jpg', icon: '🏛️' },
      { id: 'lotusmahal', name: 'Lotus Mahal', file: '/static/samples/lotusmahal.jpg', icon: '🌸' },
      { id: 'elephantstables', name: 'Elephant Stables', file: '/static/samples/elephantstables.jpg', icon: '🐘' },
      { id: 'narasimha', name: 'Lakshmi Narasimha', file: '/static/samples/narasimha.jpg', icon: '🦁' },
      { id: 'steppedtank', name: 'Stepped Tank', file: '/static/samples/steppedtank.jpg', icon: '🕳️' },
      { id: 'virupaksha', name: 'Virupaksha Temple', file: '/static/samples/virupaksha.jpg', icon: '🛕' }
    ];
    var html = '<div class="photo-panel">' +
      '<div class="photo-panel-head">' +
      '<b>📷 ' + esc(t('photoLookup')) + '</b>' +
      '<button type="button" class="btn" id="uploadPhotoBtn">📁 ' + esc(t('uploadOrSnap')) + '</button>' +
      '</div>' +
      '<p class="small muted">' + esc(t('photoTip')) + '</p>' +
      '<div class="sample-grid">' +
      samples.map(function (s) {
        var siteObj = byId[s.id] || { id: s.id, name: { en: s.name } };
        return '<button type="button" class="sample-card" data-sample="' + s.file + '">' +
          '<img src="' + s.file + '" class="sample-img" alt="' + esc(name(siteObj)) + '">' +
          '<span>' + s.icon + ' ' + esc(name(siteObj)) + '</span>' +
          '</button>';
      }).join('') +
      '</div></div>';
    $('guideOut').innerHTML = html;
    var ub = $('uploadPhotoBtn');
    if (ub) ub.onclick = function () { photoInput.click(); };
  }

  function renderPhotoResult(imgSrc, siteId, score) {
    var s = byId[siteId];
    if (!s) return;
    var matchPct = Math.min(96, Math.max(74, Math.round(score * 100)));
    var summary = s.summary[lang] || s.summary.en;
    var html = '<div class="photo-result">' +
      '<div class="photo-card">' +
      '<img src="' + esc(imgSrc) + '" class="photo-thumb" alt="Uploaded monument">' +
      '<div class="photo-info">' +
      '<div class="stamp ok">' + esc(t('photoMatch')) + ' &middot; ' + matchPct + '%</div>' +
      '<h3>' + esc(name(s)) + '</h3>' +
      '<p class="small muted">' + esc(summary) + '</p>' +
      '<div class="actions" style="margin-top:8px"><button class="btn" data-site="' + esc(siteId) + '">' + esc(t('viewMonument')) + ' &rarr;</button> ' +
      '<button type="button" class="btn ghost" id="retryPhotoBtn">📷 ' + esc(t('photoLookup')) + '</button></div>' +
      '</div></div>' +
      '<div class="photo-quick-picks"><b>' + esc(t('quickIdentify')) + ':</b>' +
      '<div class="quick-chips">' +
      '<button class="chip" data-site="vittala">🏛️ ' + esc(name(byId.vittala || {id:'vittala'})) + '</button>' +
      '<button class="chip" data-site="narasimha">🦁 ' + esc(name(byId.narasimha || {id:'narasimha'})) + '</button>' +
      '<button class="chip" data-site="elephantstables">🐘 ' + esc(name(byId.elephantstables || {id:'elephantstables'})) + '</button>' +
      '<button class="chip" data-site="lotusmahal">🌸 ' + esc(name(byId.lotusmahal || {id:'lotusmahal'})) + '</button>' +
      '<button class="chip" data-site="steppedtank">🕳️ ' + esc(name(byId.steppedtank || {id:'steppedtank'})) + '</button>' +
      '<button class="chip" data-site="virupaksha">🛕 ' + esc(name(byId.virupaksha || {id:'virupaksha'})) + '</button>' +
      '<button class="chip" data-site="queensbath">🏊 ' + esc(name(byId.queensbath || {id:'queensbath'})) + '</button>' +
      '</div></div></div>';
    $('guideOut').innerHTML = html;
    var rb = $('retryPhotoBtn');
    if (rb) rb.onclick = function () { showPhotoPanel(); };
  }

  function identifyPhoto(imgSrc) {
    $('guideOut').innerHTML = '<p class="muted">Analyzing monument...</p>';
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var w = 64, h = 64;
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      var imgData = ctx.getImageData(0, 0, w, h).data;

      var aspect = img.width / img.height;
      var rSum = 0, gSum = 0, bSum = 0, darkCount = 0, greenCount = 0;
      var totalPixels = w * h;

      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var idx = (y * w + x) * 4;
          var r = imgData[idx], g = imgData[idx + 1], b = imgData[idx + 2];
          rSum += r; gSum += g; bSum += b;
          var lum = (r * 0.299 + g * 0.587 + b * 0.114);
          if (lum < 55) darkCount++;
          if (g > r * 1.15 && g > b * 1.15 && g > 60) greenCount++;
        }
      }

      var avgR = rSum / totalPixels;
      var avgG = gSum / totalPixels;
      var avgB = bSum / totalPixels;
      var darkRatio = darkCount / totalPixels;
      var greenRatio = greenCount / totalPixels;

      var scores = {
        steppedtank: 0.3,
        elephantstables: 0.35,
        lotusmahal: 0.35,
        narasimha: 0.35,
        vittala: 0.4,
        virupaksha: 0.35,
        queensbath: 0.3
      };

      if (darkRatio > 0.25 || (avgR < 80 && avgG < 80 && avgB < 80)) scores.steppedtank += 0.45;
      if (aspect > 1.25) scores.elephantstables += 0.35;
      if (greenRatio > 0.07) { scores.elephantstables += 0.3; scores.lotusmahal += 0.35; }
      if (avgR > 130 && avgG > 120 && aspect > 0.85 && aspect < 1.35) scores.lotusmahal += 0.3;
      if (aspect < 0.95) scores.virupaksha += 0.35;
      if (aspect < 1.05 && darkRatio > 0.15 && greenRatio < 0.04) scores.narasimha += 0.35;
      if (aspect >= 0.95 && aspect <= 1.4 && greenRatio < 0.06 && darkRatio < 0.25) scores.vittala += 0.35;

      if (you) {
        Object.keys(scores).forEach(function (id) {
          var s = byId[id];
          if (s) {
            var d = km(you, s);
            if (d < 0.2) scores[id] += 0.45;
            else if (d < 0.5) scores[id] += 0.25;
          }
        });
      }

      var candidates = Object.keys(scores).map(function (id) { return { id: id, score: scores[id] }; });
      candidates.sort(function (a, b) { return b.score - a.score; });
      renderPhotoResult(imgSrc, candidates[0].id, candidates[0].score);
    };
    img.onerror = function () {
      $('guideOut').innerHTML = '<p class="muted">' + esc(t('error')) + '</p>';
    };
    img.src = imgSrc;
  }
  $('planForm').addEventListener('submit', function (e) { e.preventDefault(); runPlan(); });
  $('locBtn').addEventListener('click', function () {
    picking = !picking;
    this.textContent = t(picking ? 'tapNow' : 'setLoc');
    this.classList.toggle('on', picking);
  });
  $('gpsBtn').addEventListener('click', function () {
    if (!navigator.geolocation) { $('locBtn').click(); return; }  // no GPS: pick on the map instead
    navigator.geolocation.getCurrentPosition(function (pos) {
      setYou({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      map.setView([you.lat, you.lon], 15);
    }, function () { $('locBtn').click(); });
  });
  window.addEventListener('hashchange', fromHash);
  window.addEventListener('online', function () { setOffline(false); });
  window.addEventListener('offline', function () { setOffline(true); });
  if (!navigator.onLine) setOffline(true);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');

  getJSON('/api/sites').then(function (data) {
    sites = data.sites; starts = data.starts;
    sites.forEach(function (s) { byId[s.id] = s; });
    initMap();
    document.querySelector('#planMode button[data-mode="walk"]').classList.add('on');
    $('signLinks').innerHTML = sites.map(function (s) {
      return '<a href="/sign/' + s.id + '">' + esc(s.name.en) + '</a>';
    }).join('');
    applyLang();
    applyLargeText();
    showTab(window.innerWidth >= 900 ? 'places' : 'map');
    fromHash();
  });
})();
