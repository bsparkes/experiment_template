function make_slides(f) {
  var slides = {};

  /* For Ling245, no need to change the code
   for i0 and consent slides*/
  slides.i0 = slide({
    name: "i0",
    start: function() {
      exp.startT = Date.now();
    }
  });

  slides.consent = slide({
    name: "consent",
    start: function() {
      exp.startT = Date.now();
      $("#consent_2").hide();
      exp.consent_position = 0;
    },
    button: function() {
      if (exp.consent_position == 0) {
        exp.consent_position++;
        $("#consent_1").hide();
        $("#consent_2").show();
      } else {
        exp.go(); //use exp.go() if and only if there is no "present" data.
      }
    }
  });

  /*Consult the code in the consent slide if you
    want to break down very long instructions */
  slides.instructions = slide({
    name: "instructions",
    button: function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.example = slide({
    name: "example",
    start: function() {
      $(".err").hide();
      $('input[name=exChoice]:checked').prop('checked', false);
    },
    button: function() {
      // make sure participants understand
      // the task before they continue
      // response = $("#text_response").val();
      // if (response.length == 0) {
      //   $(".err").show();
      // } else {
      //   exp.data_trials.push({
      //     "trial_type" : "example",
      //     "response" : response
      //   });
      //   exp.go(); //make sure this is at the *end*, after you log your data
      // }
      exp.go(); //use exp.go() if and only if there is no "present" data.
    },
  });

  slides.trial = slide({

    // exp.criticalResponse = slides.trial

    name: "trial",
    start: function() {

      slide.condition = 0;
      slide.onto = 1;
      $(".err").hide();
      console.log(currentTrial)
      console.log('Trial slide info:')
      console.log('order')
      console.log(trialOrder)

      console.log(trials[currentTrial])

    },


    present: trialOrder, // [exp.trialInf],

    //this gets run only at the beginning of the block, which means for each 'present' thing.
    present_handle: function(stim) {

      exp.trialInf = trials[trialOrder[currentTrial]];

      specifyCards(exp.trialInf)

      $("#trialCondition").html(conditionSentence(exp.trialInf["prime"], exp.trialInf["primeOneSymbols"][0]));

      $(".err").hide();
      $(".targetContainerL").hide();
      $(".targetContainerR").hide();
      $(".primeTwoContainerL").hide();
      $(".primeTwoContainerR").hide();
      $(".primeOneContainerL").show();
      $(".primeOneContainerR").show();

      // uncheck the button and erase the previous value
      exp.criticalResponse = null;
      exp.primeOneChoice = null;
      exp.primeTwoChoice = null;
      exp.targetChoice = null;
      $('input[name=primeOneChoice]:checked').prop('checked', false);
      $('input[name=primeTwoChoice]:checked').prop('checked', false);
      $('input[name=targetChoice]:checked').prop('checked', false);
      $("#criticalSentence").html(stim);

      this.stim = stim; // I like to store this information in the slide so I can record it later.
    },

    cardButton: function() { // if a card is selected
      $('.err').hide(); // hide error
      slide.condition = 1; // note that something is selected
    },

    /*
      The button function does a lot.
      Primarily, it updates the slide to follow the trial.
      We do this by first showing relevant info for the first prime, and then if a selection has
      been made we update to the second, and then to the target, when we store information and then
      move to the next trial.
      The function does this by checking in reverse, as target takes precedence over primeTwo, etc…
    */

    button: function() { // what to do when the lower button is clicked
      if (slide.condition == 1) { // so long as a button is clicked, we update
        $(".err").hide(); // hide error
        exp.targetChoice = $('input[name=targetChoice]:checked').val(); // now update one button values
        exp.primeOneChoice = $('input[name=primeOneChoice]:checked').val();
        exp.primeTwoChoice = $('input[name=primeTwoChoice]:checked').val();
        if (exp.targetChoice != null) { // if one hasn't chosen the target
          console.log('got target')
          console.log('exp.trialInf')
          console.log(exp.trialInf)
          currentTrial++
          console.log('currentTrial')
          console.log(currentTrial)
          this.log_responses();
          /* use _stream.apply(this); if and only if there is
          "present" data. (and only *after* responses are logged) */
          _stream.apply(this);
        } else if (exp.primeTwoChoice != null) { // if one hasn't chosen the second prime
          $("#trialCondition").html(conditionSentence(exp.trialInf["target"], exp.trialInf["targetSymbols"][0]));
          console.log('got two')
          $(".primeTwoContainerL").hide();
          $(".primeTwoContainerR").hide();
          $(".targetContainerL").show();
          $(".targetContainerR").show();
          slide.condition = 0;
        } else if (exp.primeOneChoice != null) { // if one hasn't chosen the first
          $("#trialCondition").html(conditionSentence(exp.trialInf["prime"], exp.trialInf["primeTwoSymbols"][0]));
          console.log('got one')
          $(".primeOneContainerL").hide();
          $(".primeOneContainerR").hide();
          $(".primeTwoContainerL").show();
          $(".primeTwoContainerR").show();
          slide.condition = 0;
        }
      } else { // otherwise show error
        $('.err').show()
      }
    },

    log_responses: function() {
      exp.data_trials.push({
        "trial_type": "critical",
        "trial_data": exp.trialInf,
        "primeOneChoice": exp.primeOneChoice,
        "primeTwoChoice": exp.primeTwoChoice,
        "targetChoice": exp.targetChoice,
      });
      console.log(exp.trialInf)
    }

  });

  slides.critical = slide({
    name: "critical",

    /* trial information for this block
     (the variable 'stim' will change between each of these values,
      and for each of these, present_handle will be run.) */
    present: _.shuffle([
      "John and Mary laugh.",
      "Does John and Mary laugh?",
      "John and I am happy."
    ]),

    //this gets run only at the beginning of the block
    present_handle: function(stim) {
      $(".err").hide();

      // uncheck the button and erase the previous value
      exp.criticalResponse == null;
      $('input[name=criticalChoice]:checked').prop('checked', false);
      $("#criticalSentence").html(stim);

      this.stim = stim; //you can store this information in the slide so you can record it later.

    },

    button: function() {
      //find out the checked option
      exp.criticalResponse = $('input[name=criticalChoice]:checked').val();

      // verify the response
      if (exp.criticalResponse == null) {
        $(".err").show();
      } else {
        this.log_responses();

        /* use _stream.apply(this); if and only if there is
        "present" data. (and only *after* responses are logged) */
        _stream.apply(this);
      }
    },

    log_responses: function() {
      exp.data_trials.push({
        "trial_type": "critical",
        //"sentence": this.stim, // don't forget to log the stimulus
        "response": exp.criticalResponse
      });
    }
  });

  slides.subj_info = slide({
    name: "subj_info",
    submit: function(e) {
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language: $("#language").val(),
        enjoyment: $("#enjoyment").val(),
        asses: $('input[name="assess"]:checked').val(),
        age: $("#age").val(),
        gender: $("#gender").val(),
        education: $("#education").val(),
        comments: $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val()
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name: "thanks",
    start: function() {
      exp.data = {
        "trials": exp.data_trials,
        "catch_trials": exp.catch_trials,
        "system": exp.system,
        "condition": exp.condition,
        "subject_information": exp.subj_data,
        "time_in_minutes": (Date.now() - exp.startT) / 60000
      };
      setTimeout(function() {
        turk.submit(exp.data);
      }, 1000);
    }
  });

  return slides;
}

/// init ///
function init() {
  //specify conditions
  // exp.condition = _.sample(["Some of the symbols are", "There are four", "There is a"]); //can randomize between subject conditions here
  //blocks of the experiment:
  exp.structure = ["i0", "instructions", "trial", "trial", "trial", //"subj_info",
    "thanks"
  ];
  console.log(exp.structure)

  // bottchemla stuff
  // exp.sym1 = 0
  // exp.sym2 = 0
  // getSymbols()

  exp.trialStims = {
    "comparatives": ["John ate more food than this burger.",
      "Mary had more pets than Fido."
    ],
    "multiple negations": ["No head injury is too severe to depair",
      "No head injury is too trivial to ignore"
    ]
  }[exp.condition];

  // generally no need to change anything below
  exp.trials = [];
  exp.catch_trials = [];
  exp.data_trials = [];
  exp.system = {
    Browser: BrowserDetect.browser,
    OS: BrowserDetect.OS,
    screenH: screen.height,
    screenUH: exp.height,
    screenW: screen.width,
    screenUW: exp.width
  };

  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
  //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {
        $("#mustaccept").show();
      });
      exp.go();
    }
  });

  exp.go(); //show first slide
}