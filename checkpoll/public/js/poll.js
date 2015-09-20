/* Javascript for PollBlock. */
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function CheckPollUtil (runtime, element, pollType) {
    var self = this;

    this.init = function() {
        // Initialization function used for both Poll Types
        this.voteUrl = runtime.handlerUrl(element, 'vote');
        this.tallyURL = runtime.handlerUrl(element, 'get_results');
        this.downloadUrl = runtime.handlerUrl(element, 'download_results');
        console.log(this.downloadUrl);

        this.submit = $('input[type=button]', element);


        this.answers = $('input[type=radio]', element);

        this.checkAnswers = $('input[type=checkbox]', element); //get the array of checkboxes
        this.resultsTemplate = Handlebars.compile($("#" + pollType + "-results-template", element).html());  //modify handlebar!!

        this.viewResultsButton = $('.view-results-button', element);
        this.viewResultsButton.click(this.getResults);


        // If the submit button doesn't exist, the user has alread
        // selected a choice. Render results instead of initializing machinery.
        var max_submissions = parseInt($('.poll-max-submissions', element).text());
        var current_count = parseInt($('.poll-current-count', element).text());

        if (max_submissions == current_count) {
            self.onSubmit({'success': true});
            return false;

        }
        if (pollType != "checkpoll") {
            if (! self.submit.length) {
                self.onSubmit({'success': true});
                return false;
            }
        }

        if (max_submissions > 1 && current_count > 0) {
            $('.poll-submissions-count', element).show();
        }
        return true;
    };

    this.checkPollInit = function(){
        // Initialization function for Survey Blocks

        // If the user is unable to vote, disable input.
        if (! $('div.poll-block', element).data('can-vote')) {
            $('input', element).attr('disabled', true);
            return
        }

        self.checkAnswers.bind("change.enableSubmit", self.verifyAll);

        self.submit.click(function () {
            $.ajax({
                type: "POST",
                url: self.voteUrl,
                data: JSON.stringify({choices: self.checkPollChoices(), username: self.getUserName()}),
                success: self.onSubmit
            })
        });
        // If the user has refreshed the page, they may still have an answer
        // selected and the submit button should be enabled.
        self.verifyAll();
    };

    this.getUserName = function () {
        var edxInfo = getCookie("edx-user-info").replace(/\\054/g, ',').replace(/\\"/g, '"');
        if (edxInfo.charAt(0) == '"')
            edxInfo = edxInfo.substring(1);
        if (edxInfo.charAt(edxInfo.length-1) == '"')
            edxInfo = edxInfo.substring(0,edxInfo.length-1);
        var username = JSON.parse(edxInfo).username;
        return username;
    }

    this.checkPollChoices = function () {
        var choices = [];
        self.checkAnswers.each(function(index, el) {
            if (el.checked) {
                el = $(el);
                choices.push(el.val()); //maybe element is needed
            }
        });
        return choices;
    };


    this.pollInit = function(){
        // Initialization function for PollBlocks.
        var selector = 'input[name=choice]:checked';
        var radio = $(selector, element);
        self.submit.click(function () {
            // We can't just use radio.selector here because the selector
            // is mangled if this is the first time this XBlock is added in
            // studio.
            radio = $(selector, element);
            var choice = radio.val();
            var thanks = $('.poll-voting-thanks', element);
            thanks.addClass('poll-hidden');
            // JQuery's fade functions set element-level styles. Clear these.
            thanks.removeAttr('style');
            $.ajax({
                type: "POST",
                url: self.voteUrl,
                data: JSON.stringify({"choice": choice,  username: self.getUserName()}),
                success: self.onSubmit
            });
        });
        // If the user has already reached their maximum submissions, all inputs should be disabled.
        if (!$('div.poll-block', element).data('can-vote')) {
            $('input', element).attr('disabled', true);
        }
        // If the user has refreshed the page, they may still have an answer
        // selected and the submit button should be enabled.
        var answers = $('input[type=radio]', element);
        if (! radio.val()) {
            answers.bind("change.enableSubmit", self.enableSubmit);
        } else if ($('div.poll-block', element).data('can-vote')) {
            self.enableSubmit();
        }
    };

    this.surveyInit = function () {
        // Initialization function for Survey Blocks

        // If the user is unable to vote, disable input.
        if (! $('div.poll-block', element).data('can-vote')) {
            $('input', element).attr('disabled', true);
            return
        }
        self.answers.bind("change.enableSubmit", self.verifyAll);
        self.submit.click(function () {
            $.ajax({
                type: "POST",
                url: self.voteUrl,
                data: JSON.stringify(self.surveyChoices()),
                success: self.onSubmit
            })
        });
        // If the user has refreshed the page, they may still have an answer
        // selected and the submit button should be enabled.
        self.verifyAll();
    };

    this.surveyChoices = function () {
        // Grabs all selections for survey answers, and returns a mapping for them.
        var choices = {};
        self.answers.each(function(index, el) {
            el = $(el);
            choices[el.prop('name')] = $(self.checkedElement(el), element).val();
        });
        return choices;
    };

    this.checkedElement = function (el) {
        // Given the DOM element of a radio, get the selector for the checked element
        // with the same name.
        return "input[name='" + el.prop('name') + "']:checked"
    };

    this.verifyAll = function () {
        // Verify that all questions have an answer selected.
        var doEnable = true;

        if (pollType == "checkpoll") {
            var temp = [];
            //seems that this function should be the same
            self.checkAnswers.each(function (index, el) {
                if (el.checked) {
                    el = $(el);
                    temp.push(el.val()); //maybe element is needed
                }

            });

            if (! temp.length) {
                doEnable = false;
                return false
            }
        } else {
            self.answers.each(function (index, el) {
                if (!$(self.checkedElement($(el)), element).length) {
                    doEnable = false;
                    return false
                }
            });
        }

        if (doEnable){
            self.enableSubmit();
        }
    };

    this.onSubmit = function (data) {
        // Fetch the results from the server and render them.
        if (!data['success']) {
            alert(data['errors'].join('\n'));
        }
        var can_vote = data['can_vote'];
        $('.poll-current-count', element).text(data['submissions_count']);
        if (data['max_submissions'] > 1) {
            $('.poll-submissions-count', element).show();
        }
        if ($('div.poll-block', element).data('private')) {
            // User may be changing their vote. Give visual feedback that it was accepted.
            var thanks = $('.poll-voting-thanks', element);
            thanks.removeClass('poll-hidden');
            thanks.fadeOut(0).fadeIn('slow', 'swing');
            $('.poll-feedback-container', element).removeClass('poll-hidden');
            if (can_vote) {
                $('input[name="poll-submit"]', element).val('Resubmit');
            } else {
                $('input', element).attr('disabled', true)
            }
            return;
        }
        // Used if results are not private, to show the user how other students voted.
        self.getResults();
    };

    this.getResults = function () {
        // Used if results are not private, to show the user how other students voted.
        $.ajax({
            // Semantically, this would be better as GET, but we can use helper
            // functions with POST.
            type: "POST",
            url: self.tallyURL,
            data: JSON.stringify({}),
            success: function (data) {
                $('div.poll-block', element).html(self.resultsTemplate(data));
                this.downloadResultsButton = $('.download-results-button', element);
                //this.downloadResultsButton.click(this.downloadResults);
                //this.downloadResultsButton.on( "click", this.downloadResults);
                $('div.poll-block', element).on('click', 'a.download-results-button', function() {
                    self.downloadResults();
                });

            }
        })
    };

    this.downloadFile = function(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    this.checkPollToCsv = function (data) {
        var csvFile = "course_info,question,username,user_id";
        var shortAnswers = [];
        for (var i = 0; i < data['answers'].length; i++) {
            csvFile += "," + data['answers'][i][1]['label'];
            shortAnswers.push(data['answers'][i][0]);
        }
        csvFile += "\n";

        var course_info = data['course_info'];
        var question = data['question'];
        var question = data['question'];

        for (var i = 0; i < data['detailed_tally'].length; i++) {
            csvFile += course_info + "," + question + ",";
            csvFile += data['detailed_tally'][i]['username'] + "," + data['detailed_tally'][i]['user_id'];

            if (pollType == "checkpoll") {
                for (var j = 0; j < shortAnswers.length; j++) {
                    if (data['detailed_tally'][i]['choices'].indexOf(shortAnswers[j]) != -1) {
                        csvFile += ",+";
                    } else {
                        csvFile += ",-";
                    }
                }
            } else if (pollType == "poll"){
                for (var j = 0; j < shortAnswers.length; j++) {
                    if (data['detailed_tally'][i]['choice'] == shortAnswers[j]) {
                        csvFile += ",+";
                    } else {
                        csvFile += ",-";
                    }
                }
            }
            csvFile += "\n";
        }
        return csvFile;
    }

    this.downloadResults = function () {
        // Used if results are not private, to show the user how other students voted.
        $.ajax({
            // Semantically, this would be better as GET, but we can use helper
            // functions with POST.
            type: "POST",
            url: self.downloadUrl,
            data: JSON.stringify({}),
            success: function (data) {
                self.downloadFile(data['course_info']+'.csv', self.checkPollToCsv(data));
            }
        })
    };


    this.enableSubmit = function () {
        // Enable the submit button.
        self.submit.removeAttr("disabled");
        self.checkAnswers.unbind("change.enableSubmit");  //HERE IS THE BUGGG
        self.answers.unbind("change.enableSubmit");
    };

    var run_init = this.init();
    if (run_init) {
        var init_map = {'poll': self.pollInit, 'survey': self.surveyInit, 'checkpoll': self.checkPollInit};
        init_map[pollType]()
    }

}

function CheckPollBlock(runtime, element) {
    new CheckPollUtil(runtime, element, 'checkpoll');
}

function PollBlock(runtime, element) {
    new CheckPollUtil(runtime, element, 'poll');
}

function SurveyBlock(runtime, element) {
    new CheckPollUtil(runtime, element, 'survey');
}
