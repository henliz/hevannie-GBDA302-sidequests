// story.js - all narrative content for Front Desk
// each scene: speaker, lines[], visual, choices[] or next
// choices carry trust AND standing - the tension is the point

// ---- ending thresholds (used in sketch.js) ----
const TRUST_HIGH    = 20;
const STANDING_HIGH = 5;

const SCENES = {

  intro: {
    speaker: null,
    lines: [
      '11:47 PM.',
      'The fluorescent above the desk has been flickering for three weeks.',
      'Aldren Building. Night shift.',
      'The overnight cleaning crew left an hour ago.',
      'Since then: nothing.',
      'Your coffee is cold. Your shift ends at 6.'
    ],
    visual: { bg: 'night', visitor: null },
    next: 'v1_arrive'
  },

  v1_arrive: {
    speaker: null,
    lines: [
      'The lobby doors push open.',
      'A woman, mid-fifties. Coat soaked through.',
      'She has been standing outside for a while - you can see it in how she holds herself.',
      'She spots the desk and comes straight to you.'
    ],
    visual: { bg: 'rain', visitor: 'woman' },
    next: 'v1_choice'
  },

  v1_choice: {
    speaker: 'Her',
    lines: [
      '"My daughter is in 8B. Elena Park."',
      '"She was supposed to call me at ten."',
      '"She always calls."'
    ],
    visual: { bg: 'rain', visitor: 'woman' },
    choices: [
      { label: 'Let her up',                    next: 'v1_yes', trust: +15, standing: -8  },
      { label: 'Visitor hours ended at ten.',   next: 'v1_no',  trust: -10, standing: +5  }
    ]
  },

  v1_yes: {
    speaker: null,
    lines: [
      'You call up to 8B. It rings out.',
      'The policy sign is right there on the desk.',
      'You buzz the service elevator anyway.',
      'She does not say anything.',
      'She just nods - the kind of nod that means more than it looks like.',
      'The doors close.'
    ],
    visual: { bg: 'night', visitor: null },
    next: 'v2_arrive'
  },

  v1_no: {
    speaker: null,
    lines: [
      'You explain the policy. Visitor hours. Liability.',
      'You say it the way you have said it before.',
      'She does not argue.',
      'She stands there for a moment, like she is waiting to see if you will change your mind.',
      'Then she turns and walks back out into the rain.'
    ],
    visual: { bg: 'rain', visitor: null },
    next: 'v2_arrive'
  },

  v2_arrive: {
    speaker: null,
    lines: [
      '1:12 AM.',
      'Knocking on the glass - sharper than it needs to be.',
      'A man in a work jacket, clipboard under one arm.',
      'He holds his building pass up against the glass before you have asked.'
    ],
    visual: { bg: 'night', visitor: 'man' },
    next: 'v2_choice'
  },

  v2_choice: {
    speaker: 'Him',
    lines: [
      '"HVAC. Emergency call-out."',
      'He slides a work order under the door.',
      'Slightly damp. The date smudged to nothing.',
      'His pass shows a face that matches.',
      'The expiry date does not.',
      'Six months ago.'
    ],
    visual: { bg: 'night', visitor: 'man' },
    choices: [
      { label: 'Buzz him in',                next: 'v2_yes', trust: -5,  standing: -10 },
      { label: 'The pass is expired.',       next: 'v2_no',  trust: +10, standing: +10 }
    ]
  },

  v2_yes: {
    speaker: null,
    lines: [
      'You buzz him in.',
      'He is in the building for nineteen minutes.',
      'Something clicks in the vents above the desk.',
      'The heating comes on for the first time all night.',
      'You write: contractor attended. Works completed.',
      'You do not write the pass expiry.'
    ],
    visual: { bg: 'night', visitor: null },
    next: 'v3_arrive'
  },

  v2_no: {
    speaker: null,
    lines: [
      'You tap the expiry date through the glass.',
      'He argues for a bit - not angry, just practiced.',
      'Then he steps away and makes a call.',
      'Twenty-two minutes later a different contractor arrives.',
      'Current pass. Countersigned work order.',
      'She fixes it in eight minutes.'
    ],
    visual: { bg: 'night', visitor: null },
    next: 'v3_arrive'
  },

  v3_arrive: {
    speaker: null,
    lines: [
      '2:31 AM.',
      'There is a man on the bench outside the main entrance.',
      'He has been there since before 2.',
      'Paper bag between his feet. Coat too thin for the temperature.',
      'Not trying to get in. Not asking anything of anyone.',
      'Just sitting there.'
    ],
    visual: { bg: 'cold', visitor: 'elder' },
    next: 'v3_choice'
  },

  v3_choice: {
    speaker: null,
    lines: [
      'The thermometer by the door reads four degrees.',
      'He has not moved.',
      'You have a spare chair.'
    ],
    visual: { bg: 'cold', visitor: 'elder' },
    choices: [
      { label: 'Let him wait inside',   next: 'v3_yes', trust: +20, standing: -5  },
      { label: 'Stay at the desk.',     next: 'v3_no',  trust: -15, standing: +5  }
    ]
  },

  v3_yes: {
    speaker: null,
    lines: [
      'You knock on the glass to get his attention.',
      'Point to the door. He takes a moment to understand.',
      'He comes in slowly, nods once, and sits in the chair by the window.',
      'He does not ask for anything else.',
      'Around 3 AM you fold your jacket over him.',
      'He is asleep long before morning shift arrives.'
    ],
    visual: { bg: 'night', visitor: 'elder_in' },
    next: 'ending'
  },

  v3_no: {
    speaker: null,
    lines: [
      'You stay at the desk.',
      'You check the window at 2:50.',
      'At 3:15.',
      'At 3:42 the bench is empty.',
      'You do not know where he went.'
    ],
    visual: { bg: 'cold', visitor: null },
    next: 'ending'
  },

  // ---- 4 endings based on trust + standing combo ----

  ending_both_high: {
    speaker: null,
    lines: [
      '5:58 AM.',
      'A voicemail on the lobby line.',
      '"This is Elena Park. My daughter is fine."',
      '"She had fallen asleep at her desk. Phone on silent."',
      '"The person at the front desk let me up. I want you to know that."',
      'There is also an email from Hensley.',
      '"Clean log. Contractor handled correctly. Good work."',
      'Morning shift arrives four minutes early.',
      'You step outside.',
      'It is cold, but the sky is starting to lighten somewhere to the east.'
    ],
    visual: { bg: 'morning_warm', visitor: null },
    next: 'credits'
  },

  ending_human: {
    speaker: null,
    lines: [
      '5:58 AM.',
      'A voicemail on the lobby line.',
      '"This is Elena Park. My daughter is fine."',
      '"The person at the front desk let me up. I want you to know that."',
      'There is a calendar invite from Hensley.',
      'Monday, 9 AM. Subject: Quick catch-up re: Friday log.',
      'You sign out.',
      'Some things are worth a conversation.'
    ],
    visual: { bg: 'morning_warm', visitor: null },
    next: 'credits'
  },

  ending_corporate: {
    speaker: null,
    lines: [
      '6:01 AM.',
      'An email from Hensley. Subject: Last Night.',
      '"Contractor handled correctly. Building access policy upheld."',
      '"Commendation added to your file."',
      'The lobby is quiet.',
      'Everything is where it should be.',
      'You take the bus home.',
      'You do not think about the bench outside.'
    ],
    visual: { bg: 'morning_mid', visitor: null },
    next: 'credits'
  },

  ending_both_low: {
    speaker: null,
    lines: [
      '6:00 AM.',
      'A sticky note on the monitor.',
      '"See me Monday re: contractor access log.  - Hensley"',
      'And: a message flag. Someone called about a woman turned away Friday night.',
      'And: a formal complaint from the contractor\'s company. Unauthorized entry.',
      'You clock out.'
    ],
    visual: { bg: 'morning_grey', visitor: null },
    next: 'credits'
  },

  credits: {
    speaker: null,
    lines: [ ' ' ],
    visual: { bg: 'night', visitor: null },
    next: null
  }

};
