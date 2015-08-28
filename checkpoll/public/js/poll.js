/* Javascript for PollBlock. */

function PollUtil (runtime, element, pollType) {
    var self = this;

    this.init = function() {
        console.log("this init");
        // Initialization function used for both Poll Types
        this.voteUrl = runtime.handlerUrl(element, 'vote');
        this.tallyURL = runtime.handlerUrl(element, 'get_results');

        this.submit = $('input[type=button]', element);

        this.checkAnswers = $('input[type=checkbox]', element); //get the array of checkboxes

        this.resultsTemplate = Handlebars.compile($("#" + pollType + "-results-template", element).html());  //modify handlebar!!
        this.viewResultsButton = $('.view-results-button', element);
        this.viewResultsButton.click(this.getResults);
        // If the submit button doesn't exist, the user has alread
        // selected a choice. Render results instead of initializing machinery.
        if (! self.submit.length) {
            self.onSubmit({'success': true});
            return false;
        }
        var max_submissions = parseInt($('.poll-max-submissions', element).text());
        var current_count = parseInt($('.poll-current-count', element).text());
        if (max_submissions > 1 && current_count > 0) {
            $('.poll-submissions-count', element).show();
        }
        return true;
    };

    this.checkPollInit = function(){
        console.log("checkpollInit");
        // Initialization function for Survey Blocks

        // If the user is unable to vote, disable input.
        if (! $('div.poll-block', element).data('can-vote')) {
            $('input', element).attr('disabled', true);
            return
        }

        console.log("verify all");
        self.checkAnswers.bind("change.enableSubmit", self.verifyAll);

        self.submit.click(function () {
            $.ajax({
                type: "POST",
                url: self.voteUrl,
                data: JSON.stringify(self.checkPollChoices()),
                success: self.onSubmit
            })
        });
        // If the user has refreshed the page, they may still have an answer
        // selected and the submit button should be enabled.
        self.verifyAll();
    };

    this.checkPollChoices = function () {
        console.log("checkpollChoices");
        var choices = [];
        self.checkAnswers.each(function(index, el) {
            if (el.checked) {
                el = $(el);
                choices.push(el.val()); //maybe element is needed
            }
        });
        return choices;
    };

    this.checkedElement = function (el) {
        console.log("checked element");
        // Given the DOM element of a radio, get the selector for the checked element
        // with the same name.
        return "input[name='" + el.prop('name') + "']:checked"
    };

    this.verifyAll = function () {
        console.log("verify all");
        // Verify that all questions have an answer selected.
        var doEnable = true;

        //seems that this function should be the same
        self.checkAnswers.each(function (index, el) {
            var temp = [];
            if (el.checked) {
                el = $(el);
                temp.push(el.val()); //maybe element is needed
            }

            if (! temp.length) {
                doEnable = false;
                return false
            }
        });

        if (doEnable){
            self.enableSubmit();
        }
    };

    this.onSubmit = function (data) {
        console.log("on submit");
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
        console.log("get rsults");
        // Used if results are not private, to show the user how other students voted.
        $.ajax({
            // Semantically, this would be better as GET, but we can use helper
            // functions with POST.
            type: "POST",
            url: self.tallyURL,
            data: JSON.stringify({}),
            success: function (data) {
                $('div.poll-block', element).html(self.resultsTemplate(data));
            }
        })
    };

    this.enableSubmit = function () {
        console.log("enable submit");
        // Enable the submit button.
        self.submit.removeAttr("disabled");
        self.checkAnswers.unbind("change.enableSubmit");  //need to add checkANSWES
    };

    var run_init = this.init();
    if (run_init) {
        console.log("run init");
        var init_map = {'poll': self.pollInit, 'survey': self.surveyInit, 'checkpoll': self.checkPollInit()};
        init_map[pollType]()
    }

}

function CheckPollBlock(runtime, element) {
    new PollUtil(runtime, element, 'checkpoll');
}

function PollBlock(runtime, element) {
    new PollUtil(runtime, element, 'poll');
}

function SurveyBlock(runtime, element) {
    new PollUtil(runtime, element, 'survey');
}
