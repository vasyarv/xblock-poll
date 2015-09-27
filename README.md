# XBlock-Poll

##Установка
    1. Удалить стандатрный xblock-poll
    2. Убрать/изменить соответствующую зависимость в github.txt
    3. В случае возникновения ошибки, связанной с `egg-info` то  `pip install --upgrade setuptools`
    4. pip install -e git+https://github.com/vasyarv/xblock-poll@master#egg=xblock-poll`
    5. Если был обновлён setuptools, то нужно вернуть старую версию `pip install setuptools==0.8`
##Использование и ограничения
X-Block поодерживает функциональность стандратного xblock-poll (за исключением survey). Помимо этого блок переведён на русский язык, добавлена возможность скачивать результаты и добавлен новый тип опросов с множественным выбором. 

###Ограничения
В случае, если внутри одного курса у вас несколько раз встречается данный блок с одним и тем же вопросом, то после скачивания переименуйте соответствующим образом файл, т.к. для идентификации в файле присутствует только id курса и вопрос

В случае использования блока с множественным выбором вариантов не рекомендуется удалять варианты ответов, за которые уже были отданы голоса, т.к. это может привести к некорректной работе блока.

В случае возникновения других проблем, а так же по прочим вопросам просьба писать на vasily.ryazanov@phystech.edu


Ниже приведена официальная документация по xblock-poll

This XBlock has been contributed by [McKinsey Academy](http://mckinseyacademy.com/), and is published under the
AGPLv3 licence (see the [LICENSE](LICENSE) file). It has been developed by [OpenCraft](http://opencraft.com).

## Introduction

This XBlock enables a course author to create survey/poll elements to get
feedback from students. The XBlocks can either be *poll* or *survey* XBlocks. *Poll* XBlocks have one
question, and a series of answers. *Survey* XBlocks have several questions and a handful of (terse) answers that
a student is expect to answer each one from (Such as 'True', and 'False', or 'Agree' or 'Disagree')

## Feature Overview

Survey and Poll are both designed to minimize the amount of fiddling a course author will have to
do in order to create the user experience they desire. By default, answers in polls and questions in surveys
are able to be enhanced with [Markdown](http://daringfireball.net/projects/markdown/syntax) (though it is not recommended to do more than line formatting with it)
and images. Formatting for images is handled by the XBlock's formatters to keep a consistent and sane user experience.

The feedback section of a poll or survey is shown after a user has completed the block. It, along with a poll block's
question field, are intended to make full use of Markdown.

## Installation and configuration

This XBlock relies on [Xblock-utils](https://github.com/edx-solutions/xblock-utils), which should be installed first.

After this, XBlock-poll may be installed using its setup.py, or if you prefer to use pip, running:

    pip install /path/to/xblock_poll/repo/clone

You may specify the `-e` flag if you intend to develop on the repo.

### Setting up a course to use Polls and Surveys

To set up a course to use the Poll and Survey XBlocks, first go to your course's outline page in the studio and look
for the Advanced settings link in the top menus.

![Advanced Settings](doc_img/advanced_settings.png)

Once there, look for the *Advanced Modules List* and add `"poll"` and `"survey"` to it.

![Advanced modules configuration](doc_img/advanced_modules_list.png)

Save your changes, and you may now add a poll by clicking on the **Advanced Modules** button on the bottom of a
unit editing page and selecting either `Poll` or `Survey`.

## Poll Examples

Polls contain a single question, letting users select from an array of answers for a choice that suits them best.

Below is an example of a poll:

![Poll example](doc_img/poll.png)

When a user makes a selection and hits `submit`, their choice is sent to the server, and a tally of the results so far
is presented to them.

![Poll example results](doc_img/poll_result.png)

The top choice's percentage is shown in *orange* while the user's selection is marked by a selected (but disabled)
radio button on the side.

### Poll variations

Polls may have several customizations. Feedback may be added to a poll for display after the user has submitted their
answer. Answers may have images associated with them. The question, feedback, and answers are all permitted to contain
[Markdown](http://daringfireball.net/projects/markdown/syntax) (as well as arbitrary HTML) and so may be customized in the studio (as discussed in the next chapter).

Here is an example of a poll that uses markdown in the question and the answers, and which uses images for each
of the answers:

![Image-only poll](doc_img/img_poll.png)

This poll also contains a feedback section, which is enhanced with Markdown:

![Image-only poll results](doc_img/img_poll_result.png)

Polls may also have images and with text.

![Image and Label label poll](doc_img/img_and_label_poll.png)

Or they may have a mix of both.

![Mixed label poll](doc_img/poll_mixed.png)

Polls that have a combination of both images and text will autoformat their results so that the bars line up.

![Mixed label poll result](doc_img/poll_mixed_result.png)

## Survey Examples

A survey has multiple answers and multiple questions. The same answers are presented for each question.

Below is an example of a survey:

![Survey example](doc_img/survey.png)

When the user hits `submit`, their answer is sent to the server for tally. The results are then returned to them.

![Survey results](doc_img/survey_result.png)

The top choice's percentage is shown in *orange* while the user's selection is marked with a shaded background.

### Survey Variations

Surveys, like polls, may have several customizations. As there are multiple questions but the answers are static,
questions have the ability to use images, rather than answers. Surveys may also have a Feedback section, just as
polls do.

Here is an example of a survey that mixes use of Markdown and images in its questions:

![Mixed label survey](doc_img/survey_mixed.png)

...And here's that survey's result page (with a feedback section that uses Markdown):

![Mixed label survey results](doc_img/survey_mixed_result.png)

## Using the Studio to create Polls and Surveys

After adding a Poll or Survey to the unit you're editing, click the edit button to bring up the studio menu.

Polls will have a `Question` field, and both polls and surveys will have a `Feedback` field.

![Poll edit screen](doc_img/poll_edit.png)

After these fields, there will be a series of line items. Polls will have a set of `Answers`:

![Poll line items](doc_img/poll_line_items.png)

...while Surveys will have both `Questions` and `Answers`:

![Survey line items](doc_img/survey_line_items.png)

In polls, answers may be given images, while in surveys, questions may be given them.
See the examples sections to get an idea of how images look and fit into the layout of a poll or survey.

Questions and answers may be enhanced with Markdown and HTML. **This markup is not sanitized, and is treated as trusted
input by course authors.**

For example, putting this into a Poll's Answer field:

![Markdown mixed with HTML](doc_img/mixed_markdown.png)

...Would yield this when rendered:

![Rendered Markdown mixed with HTML](doc_img/mixed_markdown_render.png)

The following fields are customizable with [Markdown](http://daringfireball.net/projects/markdown/syntax) and custom HTML on Polls:

* Question
* Feedback
* Answers

The following fields are customizable with Markdown and custom HTML on Surveys:

* Feedback
* Questions

You may add another answer (or question, if creating a survey) by clicking the add links at the bottom of the form:

![Add links](doc_img/add_links.png)

Questions and answers are listed in the order they're used in the student display. If you need to change the order
of questions or answers, **do not swap the values of their fields** if any students may already have voted, as
those votes will be tied to that line item. Instead, use the ordering arrows on the side:

![Ordering Arrows](doc_img/ordering_arrows.png)

These will allow you to move the question or answer up and down to change its display order.

If you need to remove a question or answer, you can use the `Delete` link:

![Delete Link](doc_img/delete_link.png)

**Remember**: You must have at least two answers (and at least two questions, in the case of polls). If a user has
voted on/for the item you've deleted, they will be permitted to vote again, but will not lose progress.

You may also create a poll or survey in which the results are not shown to the user. To do this, click the checkbox
for 'Private Results':

![Private Results](doc_img/private_results.png)

**Notes on Private Results**: Users will be able to change their vote on polls and surveys with this option enabled.
An analytics event will not be fired upon the student viewing the results, as the results are never visible. A user
will see a thank you message and any feedback provided upon submission:

![Private Results Submission](doc_img/private_results_submission.png)

When you are finished customizing your poll or survey, click the `Save` button:

![Save button](doc_img/save_button.png)

...or to discard your chances, hit `Cancel` instead:

![Cancel button](doc_img/cancel_link.png)

Assuming you saved, your new poll or survey should be ready to go as soon as you publish your unit's changes.
If there are any issues, you will receive an error message specifying anything that may not be quite right yet.

## Notes

**A poll or survey should not be deployed until its construction is finalized. Changing an answer or question can
cause previous respondent's answers to remap and give an inaccurate picture of the responses.**

If a poll has changed enough that it leaves a previous voter's choice invalid, their response will be eliminated
from the tally upon their next visit, and they will be permitted to vote again. However, they will not lose progress
or their score.

Things that could make a poll's previous answers ambiguous include adding or removing a question, or adding or
removing an answer.

## Grading

Each block has a score value of 1, credited to the student upon completion of the block.

## Analytics

Two events are fired by the XBlocks-- one for viewing the results of a poll, and one for submitting the user's choice.

The resulting events look like this for polls:

    {"username": "staff", "host": "precise64", "event_source": "server", "event_type": "xblock.poll.submitted", "context": {"course_user_tags": {}, "user_id": 1, "org_id": "JediAcademy", "module": {"display_name": "Poll"}, "course_id": "JediAcademy/FW301/2015", "path": "/courses/JediAcademy/FW301/2015/xblock/i4x:;_;_JediAcademy;_FW301;_poll;_2d25e451be884aa7a15b33860d7c9647/handler/vote"}, "time": "2015-01-12T19:13:39.199098+00:00", "ip": "10.0.2.2", "event": {"url_name": "2d25e451be884aa7a15b33860d7c9647", "choice": "B"}, "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:34.0) Gecko/20100101 Firefox/34.0", "page": "x_module"}
    {"username": "staff", "host": "precise64", "event_source": "server", "event_type": "xblock.poll.view_results", "context": {"course_user_tags": {}, "user_id": 1, "org_id": "JediAcademy", "module": {"display_name": "Poll"}, "course_id": "JediAcademy/FW301/2015", "path": "/courses/JediAcademy/FW301/2015/xblock/i4x:;_;_JediAcademy;_FW301;_poll;_2d25e451be884aa7a15b33860d7c9647/handler/get_results"}, "time": "2015-01-12T19:13:39.474514+00:00", "ip": "10.0.2.2", "event": {}, "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:34.0) Gecko/20100101 Firefox/34.0", "page": "x_module"}

...And like this for surveys:

    {"username": "staff", "host": "precise64", "event_source": "server", "event_type": "xblock.survey.submitted", "context": {"course_user_tags": {}, "user_id": 1, "org_id": "JediAcademy", "module": {"display_name": "Survey"}, "course_id": "JediAcademy/FW301/2015", "path": "/courses/JediAcademy/FW301/2015/xblock/i4x:;_;_JediAcademy;_FW301;_survey;_e4975240b6c64a1e988bad86ea917070/handler/vote"}, "time": "2015-01-12T19:13:13.115038+00:00", "ip": "10.0.2.2", "event": {"url_name": "e4975240b6c64a1e988bad86ea917070", "choices": {"enjoy": "Y", "learn": "M", "recommend": "N"}}, "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:34.0) Gecko/20100101 Firefox/34.0", "page": "x_module"}
    {"username": "staff", "host": "precise64", "event_source": "server", "event_type": "xblock.survey.view_results", "context": {"course_user_tags": {}, "user_id": 1, "org_id": "JediAcademy", "module": {"display_name": "Survey"}, "course_id": "JediAcademy/FW301/2015", "path": "/courses/JediAcademy/FW301/2015/xblock/i4x:;_;_JediAcademy;_FW301;_survey;_e4975240b6c64a1e988bad86ea917070/handler/get_results"}, "time": "2015-01-12T19:13:13.513909+00:00", "ip": "10.0.2.2", "event": {}, "agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:34.0) Gecko/20100101 Firefox/34.0", "page": "x_module"}


## Viewing the Results

When running inside the edX LMS, course staff members have the ability to view results without voting.
If you want to grant members of other groups ability to view the results, you can configure the group
names in the django settings using the `XBLOCK_POLL_EXTRA_VIEW_GROUPS` setting, for example:

    XBLOCK_POLL_EXTRA_VIEW_GROUPS = ['poll_staff']
