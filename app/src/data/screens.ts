import type { DialogueLine, Screen, Speaker } from './types';

const L = (who: Speaker, text: string, tech: string): DialogueLine => ({ who, text, tech });

export const SCREENS: Screen[] = [
  // ─── Module 1 ───────────────────────────────────────────────────────────
  { id: '1.1', mod: 1, title: 'Welcome', next: 'Start the course', hero: { tagline: "The best time to talk about someone's future is before they start looking elsewhere." } },
  { id: '1.2', mod: 1, title: 'The manager effect', stat: true },
  {
    id: '1.3', mod: 1, title: 'A conversation that goes wrong',
    convo: {
      cast: 'Priya, a developer · Daniel, her manager, five weeks into the role',
      names: { M: 'Daniel', E: 'Priya' },
      lines: [
        ['E', "Daniel, do you have a minute? I've been wondering where I go from here."],
        ['M', "Sure! Honestly, just keep doing what you're doing, and we'll see what comes up at review time."],
        ['E', 'Okay. Thanks.'],
      ],
    },
    narration: 'It sounds friendly. But Priya learned nothing, and Daniel learned nothing about her. Three months later she accepts another offer.',
    reflect: {
      kicker: 'Reflect · not scored', prompt: 'What did Daniel miss?', btn: 'Compare',
      revealTitle: 'Daniel missed three things', reveal: ['A question', 'A plan', 'A follow-up'],
      suggest: "Daniel treated Priya's question as small talk. He could have asked what she meant by \"where I go from here\" and what she'd like to do next. Then they could have agreed one small step together, and set a date to follow up, instead of putting it off until review time.",
    },
  },
  {
    id: '1.4', mod: 1, title: 'Knowledge check',
    mcq: {
      q: 'When is the best time to talk with an employee about their career?',
      opts: ['Only at the annual review.', 'Only when they bring it up.', 'Regularly, in short conversations, plus a few dedicated ones each year.', 'Only when a promotion is available.'],
      correct: 2,
      right: 'Right. Small, regular conversations make the big ones easier, and they let you notice problems early.',
      wrong: 'Waiting for the review or for the employee to ask usually means the conversation starts too late.',
    },
  },

  // ─── Module 2 ───────────────────────────────────────────────────────────
  { id: '2.1', mod: 2, title: 'The three settings', settings: true, narration: "Career conversations happen in three kinds of settings. Some are planned and take an hour. Some are five minutes inside a normal one-on-one. And some arrive when you're least ready for them. Let's look at what you're likely to face in each." },
  { id: '2.2', mod: 2, title: 'Scenario map', map: true },
  {
    id: '2.3', mod: 2, title: 'Choose your setting',
    mcq: {
      q: "An employee mentions in a Monday one-on-one that they're bored. What's the best response?",
      opts: ['Schedule a separate development conversation and mention it then.', 'Ask one open question now, then decide whether to continue or book a longer slot.', 'Move on, since the meeting agenda is full.', 'Offer them a new project immediately.'],
      correct: 1, partial: { 0: true },
      notes: { 0: 'Booking a separate conversation is right only if this needs more than a few minutes.' },
      right: "Start with one open question. You'll learn whether this is a passing remark or something bigger. We'll see this exact situation in Module 5.",
      wrong: "Start with one open question. You'll learn whether this is a passing remark or something bigger. We'll see this exact situation in Module 5.",
    },
  },

  // ─── Module 3 ───────────────────────────────────────────────────────────
  { id: '3.1', mod: 3, title: 'Four steps', steps4: true, narrTop: true, narration: 'GROW is a simple structure for a coaching conversation.' },
  { id: '3.2', mod: 3, title: 'What each step sounds like', tabs: true, narrTop: true, narration: "Notice that most of these are questions. That's deliberate. People commit more strongly to plans they helped create. But questions alone aren't always the right tool, which brings us to the next screen." },
  {
    id: '3.3', mod: 3, title: 'The judgment call: Ask or Tell?', titleHi: ['ask', 'tell'],
    judge: [
      ['a', 'A new hire who has never written a development plan.', 'D', 'Directive: show an example first.'],
      ['b', 'An experienced analyst deciding between two project offers.', 'N', 'Non-directive: ask.'],
      ['c', 'A mid-level employee building confidence for a stretch role.', 'S', "Situational: ask, and add information where they're missing it."],
    ],
  },
  {
    id: '3.4', mod: 3, title: 'When feedback backfires', titleHi: ['backfires'],
    reflect: {
      kicker: 'Reflect', btn: 'Save response',
      prompt: 'Think of a time you received feedback that felt like an attack. What did you do afterwards?',
      after: "On the next screen, we'll rebuild the same conversation with a simple structure that keeps the feedback specific, honest and open to the employee's view.",
    },
    backfire: {
      panels: ['Marcus addresses Nadia across the table', 'Nadia responds, leaning back', 'Marcus ends it; Nadia looks down'],
      bubbles: [
        { panel: 1, who: 'M', problem: true, text: "\"Nadia, I need to talk about the Hartley proposal. It was sloppy. Again. You're always rushing, and you never check your work.\"", why: 'Labels the person ("sloppy") and generalizes ("always", "never"). Nadia can\'t act on a trait.' },
        { panel: 1, who: 'M', problem: true, text: "\"Honestly, it looks like you just don't care about this client.\"", why: 'States an assumption about her motives as if it were a fact.' },
        { panel: 2, who: 'E', problem: false, text: "\"That's not fair. The client changed the scope on Wednesday and the new numbers never reached me.\"", why: 'Not a problem. Nadia gives the real cause here, but nobody follows it up.' },
        { panel: 2, who: 'M', problem: true, text: "\"That's not an excuse. A good account manager would have caught it.\"", why: 'Dismisses her view and compares her with an imaginary standard.' },
        { panel: 3, who: 'M', problem: true, text: '"You need to be more careful and take more ownership. I expect better next time."', why: 'Vague advice ("more careful", "more ownership") with no action. Ends with a demand, not a question.' },
        { panel: 3, who: 'E', problem: false, text: '"Okay."', why: 'Not a problem in itself, but notice what "Okay" means: the conversation is over and nothing has been resolved.' },
      ],
      cards: [
        ['Attacking the person, not the behavior', '"You\'re careless." "You\'re not a team player."', 'People defend their identity before they consider their behavior.'],
        ['Piling on shortcomings', 'A list of everything that has gone wrong, with no way forward.', 'The employee feels judged and helpless, and has nothing to act on.'],
        ['Imposing assumptions', '"It looks like you don\'t care." "You obviously didn\'t prepare."', 'Right or wrong, the employee feels unheard, so they stop sharing the real cause.'],
        ['No invitation to respond', 'A monologue that ends with "I expect better."', 'You never learn what happened, and the employee has no ownership of the fix.'],
      ],
    },
  },
  {
    id: '3.5', mod: 3, title: 'A better way: feedback inside the conversation', oiq: true, narrTop: true,
    narration: 'Coaching is not the same as saying nothing critical. When something needs to be said, say it directly and kindly, then hand the conversation back.',
    rebuild: {
      orig: [
        "\"Nadia, I need to talk about the Hartley proposal. It was sloppy. Again. You're always rushing, and you never check your work.\"",
        "\"Honestly, it looks like you just don't care about this client.\"",
        "\"That's not an excuse. A good account manager would have caught it.\"",
        '"You need to be more careful and take more ownership. I expect better next time."',
      ],
      panels: ['Marcus sits down with Nadia, open posture', 'Nadia explains; Marcus listens', 'Both lean over a shared document'],
      bubbles: [
        { panel: 1, who: 'M', text: "\"Nadia, thanks for making time. I'd like to talk about the Hartley proposal. Is now a good moment?\"" },
        { panel: 1, who: 'M', text: '"The proposal that went out on Thursday had a pricing error."', tag: 'O' },
        { panel: 1, who: 'M', text: '"The client spotted it, and that cost us some credibility with them."', tag: 'I' },
        { panel: 1, who: 'M', text: "\"I'd like to understand what happened. What's your view?\"", tag: 'Q' },
        { panel: 2, who: 'E', text: '"The client changed the scope on Wednesday. The revised numbers never reached me, so I sent the old ones."' },
        { panel: 2, who: 'M', text: "\"That's useful, I didn't know that. So the problem started before it reached you.\"" },
        { panel: 3, who: 'M', text: '"What would help make sure scope changes reach you in time?"', tag: 'Q' },
        { panel: 3, who: 'E', text: '"A shared scope log, and a ten-minute check with the client contact before anything goes out."' },
        { panel: 3, who: 'M', text: "\"Good. Let's try that on the next two proposals. I'll ask the team to use the log. Can you set it up by Wednesday?\"" },
      ],
      cards: [
        ['O', 'Observation', "\"You're always rushing, and you never check your work.\"", '"The proposal that went out on Thursday had a pricing error."'],
        ['I', 'Impact', "\"That's not an excuse. A good account manager would have caught it.\"", '"The client spotted it, and that cost us some credibility with them."'],
        ['Q', 'Question', "\"It looks like you just don't care about this client.\"", "\"I'd like to understand what happened. What's your view?\""],
      ],
    },
  },
  { id: '3.6', mod: 3, title: 'Three habits to carry into every conversation', habits: true, compactFooter: true },
  {
    id: '3.7', mod: 3, title: 'Knowledge check: Four short scenarios', titleHi: ['Four short scenarios'],
    scen: [
      {
        label: 'The next question (GROW)', q: 'What should Chen do next?', correct: 1,
        text: 'Chen leads a customer support team. In a development conversation, Isabel has just said she wants to become a trainer in two years. Chen asked, "What do you want to be doing in two years?" and got a clear answer.',
        opts: [
          ['Suggest three training courses Isabel could take.', 'Not yet. This jumps to Options before Chen knows where Isabel stands.'],
          ['Ask, "Where are you now compared with that? What\'s already working?"', "Right. After the Goal comes Reality. Chen needs Isabel's own picture of where she stands before building a plan."],
          ['Ask Isabel to commit to a date for her first step.', 'Too early. Commitments belong in the Will step, after Reality and Options.'],
          ['Tell Isabel whether a trainer role exists.', 'Useful information, but it comes before Chen knows what Isabel has already done or can do.'],
        ],
      },
      {
        label: 'Ask or tell?', q: "What is Hana's best first move?", correct: 1,
        text: "Omar joined two weeks ago. He tells his manager, Hana, that he has never written a development plan and doesn't know where to start.",
        opts: [
          ['Ask, "What do you think a development plan should include?"', "Not the best. Omar has said he doesn't know, so questions alone will frustrate him."],
          ['Show a sample plan, explain its parts in a few minutes, then ask what Omar would put in each section.', 'Right. When someone is new to a task, inform first, then switch to questions so the plan becomes theirs.'],
          ['Suggest waiting until he has been there six months.', 'This delays support at the moment he asked for it.'],
          ['Email him a blank template and ask for it back by Friday.', 'This gives no guidance, and it makes the first plan a form to fill in, not a conversation.'],
        ],
      },
      {
        label: 'The feedback opener', q: 'Which opening follows Observation, Impact, Question?', correct: 1,
        text: 'Yuki is a designer. Twice this month her mockups arrived after the agreed date, and the developers waited two days to start. Her manager, Ben, wants to raise it today.',
        opts: [
          ['"You\'re unreliable with deadlines. Why can\'t you plan better?"', 'This labels the person, and the question is really an accusation.'],
          ['"Twice this month the mockups arrived after the agreed date, and the developers waited two days to start. What\'s getting in the way?"', "Right. It states what happened (Observation), what it caused (Impact), and asks for Yuki's view (Question)."],
          ['"I get the feeling you don\'t prioritize this team."', 'This is an assumption about her motive, not an observation.'],
          ['"Please be more careful with timing next time."', "The advice is vague and has no impact or question. Yuki can't tell what to change or why it matters."],
        ],
      },
      {
        label: 'Closing the conversation', q: 'How should Chen close?', correct: 1,
        text: 'In a development conversation, Isabel has suggested two ways to build her training skills: lead a short workshop and shadow a senior trainer. Chen has a third idea, to write the onboarding guide for new hires. Time is running short.',
        opts: [
          ['Share the onboarding guide idea straight away to save time.', 'Better to let Isabel finish first. She is more likely to own a plan she shaped.'],
          ['Ask, "What else?" once, then add the third idea, then agree on one or two actions with a date and the support Isabel needs.', 'Right. This widens the options, lets Isabel lead, and ends with a specific commitment.'],
          ['Choose the best option and tell Isabel to start next week.', 'Choosing for her takes away ownership, and nothing confirms she has the time or support.'],
          ['Say, "Let\'s keep these in mind," and move on.', 'Without an action, owner and date, nothing is likely to happen.'],
        ],
      },
    ],
  },

  // ─── Module 4 · Deep dive 1 ─────────────────────────────────────────────
  {
    id: '4.1', mod: 4, title: 'Scenario', setup: true, narrTop: true,
    narration: "Maya has booked a 45-minute development conversation with Tomás. She told him a week ago what it's for and asked him to think about where he'd like to be in two years. She's also reviewed his last two quarters of work, so she has some facts to bring.",
    takeaway: 'Preparation counts. Tell the employee the purpose in advance, ask them to reflect, and gather specific examples yourself.',
  },
  {
    id: '4.2', mod: 4, title: 'Opening and Goal', step: 'G', dialogue: 'rows',
    lines: [
      L('M', 'Thanks for making time. The purpose today is to talk about where you want your career to go and how I can help. What would make this conversation worth your time?', 'Set the purpose, then ask the employee to shape the agenda (Goal for the conversation).'),
      L('E', "I'd like to lead a team. I think I'm ready to move into a manager role.", 'Employee states an ambition.'),
      L('M', 'Tell me more. What draws you to managing people?', 'Open question. Seeks the motive instead of reacting to the title.'),
      L('E', "I enjoy helping newer writers improve. And I'd like more say in what we publish.", 'Reveals two drivers: developing others and influence over content.'),
      L('M', 'If this went really well over the next two years, what would your day look like?', 'Long-term Goal. A vivid picture beats a job title.'),
    ],
    narration: "Notice what Maya didn't do. She didn't say 'great, let's make you a manager' or 'you're not ready.' She stayed curious and learned why Tomás wants this.",
    reflect: {
      kicker: 'Pause point', prompt: "What's one thing Maya could ask next to learn more?", btn: 'See suggestions',
      revealTitle: 'Questions Maya could ask',
      reveal: ['What have you already done that gives you a taste of that?', 'Which part of leading people appeals to you most?', 'Who do you know who does this well, and what do they do?'],
    },
  },
  {
    id: '4.3', mod: 4, title: 'Reality', step: 'R', dialogue: 'rows',
    lines: [
      L('M', 'Where do you feel you are today against that picture?', "Self-assessment first. Hear the employee's view before giving your own."),
      L('E', "Strong on content quality. I'm less sure about managing people. I've mentored two interns, but that's it.", 'Honest self-view with a gap named by the employee.'),
      L('M', 'What went well with the interns?', 'Explore strengths with evidence.'),
      L('E', 'Both finished their projects. One told me she learned a lot.', 'Concrete evidence.'),
      L('M', "Here's what I've seen. Your editorial judgment is the best on the team. And twice recently, when a deadline slipped, you worked around the problem yourself without telling anyone until it was fixed. I'd want a manager to raise those problems earlier. What do you make of that?", 'Feedback in the Observation, Impact, Question form. Specific, factual, then hand it back.'),
      L('E', "That's fair. I didn't want to bother you.", 'Employee gains insight.'),
    ],
    narration: "Maya combined two moves here. She asked Tomás to assess himself first, then she added her own observations. She wasn't harsh and she wasn't vague. That's the balance of Reality.",
    takeaway: "In Reality, ask first, then add your view with specific examples. Don't let your first sentence be a verdict.",
  },
  {
    id: '4.4', mod: 4, title: 'Branching choice', step: 'R',
    branch: {
      askWho: 'Tomás asks', askText: '"So am I ready or not?"', speaker: 'Maya', prompt: 'What should Maya say?',
      options: [
        { text: "\"Yes, you're ready. I'll put you forward.\"", when: 'Later', result: "Maya has promised something she can't deliver, and Tomás is blindsided when the role goes to someone else." },
        { text: '"Not yet. Keep working on it."', when: 'After the meeting', result: 'Tomás leaves the meeting knowing nothing new. He feels dismissed.' },
        { text: "\"You're closer than you might think on content and mentoring. The gap I see is raising issues early and leading a project end to end. Shall we work out how to close it?\"", when: 'What happens next', result: 'Honest, specific and forward-looking. Tomás knows where he stands and what to work on.', best: true },
      ],
    },
    takeaway: "The honest answer is rarely yes or no. It's 'here's where you are, and here's how we get you further.'",
  },
  {
    id: '4.5', mod: 4, title: 'Options', step: 'O', dialogue: 'rows', compactFooter: true,
    lines: [
      L('M', 'What could you do over the next six months to build those skills?', 'Employee generates first.'),
      L('E', 'Maybe I could lead the autumn campaign. And I could mentor another new writer.', 'Two options offered.'),
      L('M', 'Good. What else?', '"And what else?" once, to widen the list before judging.'),
      L('E', 'I could shadow you in planning meetings, and join the management training course.', 'Two more options.'),
      L('M', "I'd add one: take over the weekly status report to the leadership team. It would give you practice raising issues early. How does that sound?", 'Manager adds an idea after the employee has contributed.'),
    ],
    takeaway: "Maya let Tomás go first, asked 'what else', and only then added her own idea. That order matters. People own what they helped create.",
  },
  {
    id: '4.6', mod: 4, title: 'Will', step: 'W', dialogue: 'rows', plan: true,
    lines: [
      L('M', 'Of these, which two will have the most impact?', 'Narrow to a few priorities.'),
      L('E', 'Leading the autumn campaign and the status report.', 'Employee chooses.'),
      L('M', 'When will you start, and what do you need from me?', 'Commitment, date and support.'),
      L('E', "The report starts next week. For the campaign, I'd like you to confirm with the director that I'm leading it. Can we check in monthly?", 'Specific ask for support.'),
      L('M', "I'll speak to the director this week. Let's put a 20-minute check-in on the calendar on the first Monday of each month. Can you write up what we agreed and send it to me?", 'Owner, date, follow-up. Employee writes the summary to build ownership.'),
    ],
    takeaway: "The conversation is not finished when you leave the room. It's finished when both of you have written down what happens next, and when you do what you said you'd do.",
  },
  {
    id: '4.7', mod: 4, title: 'Recap and knowledge check',
    recap: ['Purpose shared in advance', 'Open questions', 'Self-assessment first', 'Specific feedback', '"What else?"', 'Employee-led options', 'Written commitments'],
    mcq: {
      q: 'Maya asked "What else?" before offering her own idea. Why?',
      opts: ['To fill time.', 'To widen the options and let the employee own the plan.', 'To avoid giving advice.', 'To test Tomás.'],
      correct: 1,
      right: 'Right. "What else?" widens the list, and people own the plans they helped create.',
      wrong: 'Maya did give advice, but only after Tomás had added his own ideas. She wanted more options, and a plan Tomás would own.',
    },
    reflect: { kicker: 'Reflect', prompt: 'Which of these techniques will you try first with someone on your team?', btn: 'Save response' },
  },

  // ─── Module 5 · Deep dive 2 ─────────────────────────────────────────────
  {
    id: '5.1', mod: 5, title: 'Scenario', narrTop: true,
    narration: "It's a regular Tuesday one-on-one. Sam and Lena have covered the month-end close and two open reports. Then Lena says something Sam almost misses.",
    setupX: {
      img: 'assets/scenario-5-1.png', photo: 'Sam and Lena talking across a table during their regular one-on-one',
      cast: [['Manager', 'Sam', 'Finance team lead, eight months in the role.'], ['Employee', 'Lena', 'Financial analyst. Energetic and proactive, until recently.']],
      quoteWho: 'Lena', quote: "\"Honestly, it's been the same reports for months. I'm kind of bored.\"",
    },
  },
  {
    id: '5.2', mod: 5, title: 'Two ways to respond',
    compare: {
      context: "\"Honestly, it's been the same reports for months. I'm kind of bored.\"",
      cols: [
        ['The common reaction', '"Ha, I know. Welcome to finance. Anyway, about the Q3 forecast..."', "Lena learns it isn't safe to raise this again. The signal is lost.", false],
        ['A better reaction', "\"Thanks for telling me. I'd like to understand that a bit more. What's making it feel stale?\"", 'Lena feels heard. Sam now has information to work with.', true],
      ],
    },
    narration: "A comment like Lena's is a small test. The manager's reaction decides whether she will bring up something bigger next time, or start quietly looking elsewhere.",
    takeaway: "Treat a passing remark as data. One open question is enough to find out whether it's minor or major.",
  },
  {
    id: '5.3', mod: 5, title: 'The eight-minute GROW', dialogue: 'rows', timer: true, names: { M: 'Sam', E: 'Lena' },
    lineSteps: ['R', 'G', 'G', 'R', 'R', 'O', 'O', 'W', 'W', 'W'],
    lines: [
      L('E', "The work is fine, but I'm not learning anything. I'm doing what I did last year.", 'Reality surfaces: a growth problem, not a workload problem.'),
      L('M', 'What would you like to be learning?', 'Goal in one question.'),
      L('E', "I'd like to understand more of the business side. How decisions get made, and how our numbers feed into them.", 'Specific interest named.'),
      L('M', 'What have you tried so far?', 'Reality: checks what the employee has already done.'),
      L('E', "Not much. I didn't think there was room for it.", 'Reveals an assumption, not a real constraint.'),
      L('M', "If there were room, what's one thing you'd try?", 'Option prompt, removing the assumed barrier.'),
      L('E', 'I could sit in on the monthly business review. Or take on part of the forecast.', 'Two options.'),
      L('M', 'Both could work. Which would you start with?', 'Narrow the choice.'),
      L('E', "The business review. It's quicker to start.", 'Employee chooses.'),
      L('M', "Good. I'll ask Raj for an invite this week, and you take notes and bring back two questions to our next one-on-one. Does that work?", 'Will: owner, action, date, check-back.'),
    ],
    narration: "That took about eight minutes. Notice that Sam didn't solve Lena's problem himself. He asked about what she wants, what she's tried, and what she'd do. But he also made a concrete commitment, to ask Raj for an invite.",
  },
  {
    id: '5.4', mod: 5, title: 'Decision point: is this enough?',
    mcq: {
      q: 'Lena will sit in on the business review. How should Sam close?',
      opts: ['"Great, let\'s get back to the forecast."', '"Let\'s also set aside 45 minutes next week for a proper development conversation, since this seems bigger than one meeting."', '"I\'ll send you a list of courses."'],
      correct: 1,
      notes: { 0: "Sam misses the chance to book a follow-up. If there's more behind Lena's boredom, he won't hear it.", 2: "Sam skips Lena's own thinking. She gets a list instead of a plan she helped shape." },
      right: 'Best if the topic runs deeper than the first answer suggests. Lena has a first step now and a proper conversation booked.',
      wrong: '',
    },
    takeaway: 'Use the regular one-on-one to open the topic and make one small commitment. Use a dedicated conversation for plans.',
  },
  {
    id: '5.5', mod: 5, title: 'What if you only have two minutes?', narrTop: true,
    narration: 'If you remember nothing else, remember these three questions.',
    pocket: ["What's one thing you'd like to learn or do more of this quarter?", "What's getting in the way?", "What's one small step you could take this week?"],
  },
  {
    id: '5.6', mod: 5, title: 'Knowledge check',
    mcq: {
      q: 'Lena says she is bored. Which first response is best?',
      opts: ['"Everyone gets bored sometimes."', '"What would make the work more interesting for you?"', '"What\'s making it feel that way?"', '"Do you want to change teams?"'],
      correct: 2, partial: { 1: true },
      notes: { 1: "Close. It's open, but it jumps to a solution and leaves out what's happening now." },
      right: "Right. It's open, curious and non-leading. Lead with curiosity, not solutions. Don't suggest a move until you understand the cause.",
      wrong: "Lead with curiosity, not solutions. Don't suggest a move until you understand the cause.",
    },
  },

  // ─── Module 6 · Deep dive 3 ─────────────────────────────────────────────
  {
    id: '6.1', mod: 6, title: 'Scenario', narrTop: true,
    narration: "Jonas is one of Amara's strongest engineers. He's asked for a meeting and opens with a direct request.",
    setupX: {
      img: 'assets/scenario-6-1.png', bright: 1.35, photo: 'Jonas and Amara talking at a small round table in a meeting room',
      cast: [['Employee', 'Jonas', 'Software engineer. Consistently exceeds targets, and has just asked for a meeting.'], ['Manager', 'Amara', 'Engineering manager, one year in the role.']],
      quoteWho: 'Jonas',
      quote: "\"I've been here three years, I hit every target, and I think it's time for a promotion to senior engineer. What do I need to do to get it this cycle?\"",
      bg: [
        ['Senior engineer criteria', 'Leading a cross-team project, mentoring others, and making design decisions that other teams adopt.'],
        ['Where Jonas is', 'Excellent individual work. He has not yet led a cross-team project.'],
        ['Timing', 'The promotion cycle closes in six weeks. No senior role is open on this team this cycle.'],
      ],
    },
  },
  {
    id: '6.2', mod: 6, title: 'Decision: how do you open?',
    mcq: {
      q: 'Jonas asks, "What do I need to do to get it this cycle?" How should Amara open?',
      opts: ['"I\'ll see what I can do."', '"You\'re not ready."', '"Thank you for saying so directly. Your results have been excellent, and I want to be honest with you about where things stand. Can I walk you through how I see it, and then I\'d like to hear what you think?"'],
      correct: 2,
      notes: { 0: 'Vague hope. Jonas leaves believing a promotion is likely, and is angry six weeks later.', 1: 'Accurate, but abrupt and unexplained. Jonas feels his work is unrecognized.' },
      right: 'Jonas relaxes and listens. Amara acknowledged his work and signalled honesty before giving the decision.',
      wrong: '',
    },
    takeaway: 'The first move is to acknowledge the work and signal honesty. Then be clear. This is where a manager should be direct and informative, not Socratic.',
  },
  {
    id: '6.3', mod: 6, title: 'Direct feedback, then the question', dialogue: 'stage', names: { M: 'Amara', E: 'Jonas' },
    avatars: { M: 'assets/avatar-amara.png', E: 'assets/avatar-jonas.png' },
    lines: [
      L('M', "Your delivery has been outstanding. On the criteria for senior engineer, there are three: leading a cross-team project, mentoring others, and design decisions other teams adopt. You're strong on the technical side. What I haven't seen yet is cross-team leadership. In the last release, the integration issues were handled by the platform team and you weren't involved in coordinating them. So I can't recommend a promotion this cycle.", 'Directive. States the criteria, the observation, the evidence and the decision plainly. Does not hedge.'),
      L('E', "That's frustrating. I've done everything you asked.", "Employee's reaction is natural. Don't argue."),
      L('M', "I can see why that's frustrating. Your results have been excellent, and that's exactly why I'm being straight with you about what's missing. The decision for this cycle stays the same. What I'd like to do is help you get there.", 'Acknowledges the feeling without reopening the decision. Holds the position, then turns to the future.'),
      L('E', 'Okay. So what does it take?', 'Employee turns to the future.'),
    ],
    narration: "Amara was direct about the decision and kind about the reaction. She didn't back down, she didn't mention anyone else's promotion, and she didn't blame the budget. Now she can switch to coaching.",
    takeaway: "Name the criteria, the evidence and the decision. Acknowledge the feeling without reopening the decision. Don't compare with colleagues. If the criteria were never shared with the employee, say so as a fix going forward, not as an apology that undoes your decision.",
  },
  {
    id: '6.4', mod: 6, title: 'Switching to GROW', dialogue: 'stage', names: { M: 'Amara', E: 'Jonas' },
    avatars: { M: 'assets/avatar-amara.png', E: 'assets/avatar-jonas-curious.png' },
    lineSteps: ['G', 'R', 'R', 'O', 'O', 'O', 'O', 'W'],
    lines: [
      L('M', "Let's make a plan. If you were promoted at the next cycle, what would you want to be able to show?", 'Goal. Re-set the goal to the next cycle and make it concrete.'),
      L('M', 'What cross-team work have you done so far?', 'Reality. Honest inventory.'),
      L('E', 'Some code reviews for another team. Nothing I led.', 'Reality, in his own words.'),
      L('M', 'What could give you that experience in the next six months?', 'Options. The employee goes first.'),
      L('E', 'Leading the API migration?', 'First option.'),
      L('M', "That's a strong one. What else?", '"What else?" to widen the list.'),
      L('E', 'Running the on-call handover with platform.', 'Second option.'),
      L('M', "I'll propose you as lead for the migration at Thursday's planning meeting. You draft a one-page plan by next Friday. We'll review progress every two weeks, and I'll collect feedback from the other teams. Does that work?", 'Will. Specific commitments on both sides, with a visible milestone and a feedback source.'),
    ],
    narration: "The conversation moved from a verdict to a path. Jonas might still be disappointed, but he now knows what's expected, what's next, and that Amara is working with him.",
  },
  {
    id: '6.5', mod: 6, title: 'What not to say', titleHi: ['not'],
    flips: [
      ['"Maybe next year, we\'ll see."', "\"Here are the three criteria, and here's where I think you are on each.\""],
      ['"Dana got promoted because she\'s been here longer."', "\"I can't discuss other people's decisions, but I can explain the criteria and how I see your case.\""],
      ['"It\'s out of my hands."', "\"Here's what I can influence, and what I'll do.\""],
      ['"You just need to be more visible."', '"You need to lead a cross-team project. Here are two ways to do that."'],
    ],
  },
  {
    id: '6.6', mod: 6, title: 'Knowledge check and reflection',
    mcq: {
      q: 'Why did Amara start with direct information instead of questions?',
      opts: ['Because she wanted to end the conversation quickly.', "Because Jonas lacked clear information about the criteria, and questions wouldn't have given it to him.", "Because GROW doesn't work with high performers.", 'Because directive is always better.'],
      correct: 1,
      right: "Right. Jonas didn't know the criteria, so no question would have helped him find them. Inform first, then coach.",
      wrong: "Amara chose to be direct because Jonas was missing information he couldn't find through questions. Once he had it, she switched to coaching.",
    },
    reflect: {
      kicker: 'Reflect', btn: 'Submit', noPeek: true, revealTitle: 'Model answer', reveal: [],
      prompt: 'A team member says to you, "Why did Dana get promoted and I didn\'t?" Write the first two sentences you would say.',
      model: "\"I can't discuss other people's decisions, but I can explain the criteria and how I see your case.\"",
    },
  },

  // ─── Module 7 ───────────────────────────────────────────────────────────
  {
    id: '7.1', mod: 7, title: 'What the three conversations had in common', narrTop: true,
    narration: 'Three different situations, one shared pattern: listen first, be honest about reality, let the employee generate options, and finish with a specific commitment.',
    cmp7: {
      heads: [['Maya and Tomás', 'Dedicated check-in'], ['Sam and Lena', 'One-on-one'], ['Amara and Jonas', 'Difficult moment']],
      rows: [
        ['Style', 'Mostly non-directive', 'Non-directive, compressed', 'Directive first, then non-directive'],
        ['Time', '45 minutes', 'About 8 minutes', 'About 30 minutes'],
        ['Key technique', 'Self-assessment, specific feedback, "what else"', 'One open question, small commitment', 'Clear criteria, honest decision, ownership'],
        ['Result', 'Written development plan', 'One action and a follow-up', 'A path with milestones'],
      ],
    },
  },
  {
    id: '7.2', mod: 7, title: 'Your pre-conversation checklist',
    check7: ['Have I told the employee the purpose of the conversation?', 'Do I have two or three specific examples ready?', 'Can this person find a good answer through questions, or do I need to inform first?', "What commitments can I make, and which ones can't I?", 'When will I follow up?'],
  },
  {
    id: '7.3', mod: 7, title: 'Commit to one action', narrTop: true,
    narration: 'Pick one thing and put a date on it. Small and specific beats ambitious and vague.',
    commit: ['Add one career question to my next one-on-one.', 'Book a development conversation with someone on my team.', 'Ask my employees what they would like to learn this quarter.', 'Re-read my notes from the last conversation where I left something unresolved.'],
  },
  {
    id: '7.4', mod: 7, title: 'Final assessment',
    assess: [
      {
        type: 'match', label: 'Match questions to GROW steps', screen: '3.1',
        q: 'Each question below was asked by a manager in a real situation. Drag it to the GROW step it belongs to: Goal, Reality, Options or Will.',
        cards: [
          ['a', 'Reviewing a project that went wrong', '"You said the handover to the support team went badly last month. What actually happened, step by step?"', 'R', "It asks for facts about the present situation, from the employee's point of view."],
          ['b', 'Yearly development conversation', "\"By the end of this year, what's one thing you'd like to be trusted with that you aren't today?\"", 'G', 'It asks what the employee wants to reach.'],
          ['c', 'An employee wants a course that may not be funded', "\"If the course budget isn't approved, what other ways could you build that skill by March?\"", 'O', 'It asks for alternative paths, not a single answer.'],
          ['d', 'Closing a conversation after the employee has listed two ideas', '"Which of those would you start with, and when can you send me the first draft?"', 'W', 'It turns a choice into a commitment with a date.'],
          ['e', 'An employee says a vendor is unresponsive', '"What have you already tried to get the vendor to respond?"', 'R', 'It finds out what has been done so far.'],
          ['f', 'An employee wants to move into data analysis', '"You mentioned wanting to move toward data work. What would that role look like on a typical Tuesday?"', 'G', 'It makes the desired future concrete.'],
        ],
        order: ['c', 'f', 'a', 'd', 'e', 'b'],
        right: 'Right. Every question is in the right step.',
        wrong: 'Not every question is in the right step. Check the reasons on each card.',
      },
      {
        type: 'single', label: 'No role this cycle', screen: '6.3',
        q: 'An employee asks about promotion and there is no role this cycle. What should you do first?',
        opts: ['Be clear about the criteria, the evidence and the decision, then discuss a path forward.', 'Tell them a role might open soon, so they stay motivated.', "Explain that it's out of your hands.", 'Ask what they think they should do next.'],
        correct: 0,
        right: 'Right. Be clear first, then coach. Honesty about the decision is what makes the path forward credible.',
        wrong: 'Start by being clear about the criteria, the evidence and the decision. Vague hope or deflection damages trust, and questions come after the facts are on the table.',
      },
      {
        type: 'single', label: 'An open question in Reality', screen: '3.2',
        q: 'Which is the best example of an open question in Reality?',
        opts: ['"Are you happy with how things are going?"', "\"What's going well, and what's getting in the way?\"", '"Don\'t you think you should delegate more?"', '"What will you do by Friday?"'],
        correct: 1,
        right: "Right. It's open, and it asks for the employee's own picture of where things stand.",
        wrong: "The best choice asks what's going well and what's getting in the way. The others are closed, leading, or belong to the Will step.",
      },
      {
        type: 'multi', label: 'When to be more directive', screen: '3.3',
        q: 'When should you be more directive?',
        opts: ['The person is new to the topic.', 'The decision is time-critical.', 'The stakes are high.', 'The person is missing information they need.', 'The person has the skills and needs to build ownership.', 'You already know which option you prefer.'],
        correct: [0, 1, 2, 3],
        right: "Right. Inform first when someone is new to the topic, time is short, the stakes are high, or they're missing information.",
        wrong: "Be more directive when the person is new to the topic, time is short, the stakes are high, or they're missing information. When they have the skills, ask.",
      },
      {
        type: 'multi', label: 'A strong commitment', screen: '4.6',
        q: 'What makes a commitment strong at the Will step?',
        opts: ['A specific action', 'An owner', 'A date', 'The support needed', 'A follow-up', 'A general intention to do better', "The manager's preferred option"],
        correct: [0, 1, 2, 3, 4],
        right: 'Right. A specific action, an owner, a date, the support needed and a follow-up.',
        wrong: "A strong commitment has a specific action, an owner, a date, the support needed and a follow-up. General intentions and the manager's preference don't make it stronger.",
      },
    ],
  },
  { id: '7.5', mod: 7, title: 'Close', close7: true, next: 'End of course', narrTop: true, narration: "You don't need to be a trained coach to have a good career conversation." },
  { id: '7.6', mod: 7, title: 'Certificate of completion', cert: true, next: 'Course complete' },
];

export const SCREEN_BY_ID: Record<string, Screen> = Object.fromEntries(SCREENS.map((s) => [s.id, s]));
