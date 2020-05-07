import { Component, OnInit, OnDestroy } from "@angular/core";

import { MissionService } from "../mission.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { addQuestionTypes } from "../survey/question-types";
// import * as widgets from 'surveyjs-widgets';
// Import Survey.js
import * as Survey from "survey-angular";
// widgets.inputmask(Survey);

// data service
import { GeneralDataService, UserInfo } from "../general-data.service";

@Component({
  selector: "app-hrt-home-page",
  templateUrl: "./hrt-home-page.component.html",
  styleUrls: ["./hrt-home-page.component.scss"],
})
export class HrtHomePageComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  constructor(
    private missionService: MissionService,
    private router: Router,
    private dataService: GeneralDataService
  ) {
    this.subscription = missionService.missionAnnounced$.subscribe(
      (allFormData) => {
        console.log("allFormData", allFormData);

        if (allFormData.home) {
          this.formData = allFormData.home;
        }
        this.subscription.unsubscribe();
      }
    );
  }
  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }

  clickTest() {
      this.dataService.getUserInfo('joseph11@belmar.ca').then(res => {
          console.dir('user ifo: ', res)
          this.dataService.acceptTerms().then(response => {
              console.log('response is: ', response)
          });
      })
  }
  survey: any;
  completedSteps = {
    step1: false,
    step2: false,
  };
  currentStep = {
    home: true,
    step1: false,
    step2: false,
  };
  showForm = "";
  displayingProgressPage = false;

  private json = {
    showNavigationButtons: false,
    completeText: "HE",
    pages: [
      {
        name: "Start",
        elements: [
          {
            type: "radiogroup",
            name: "form_timeout",
            title: "Are you using a public computer?",
            isRequired: true,
            colCount: 1,
            choices: [
              {
                text:
                  "I am using a public computer (i.e. library, internet café, Service BC location)",
                value:
                  "I am using a public computer (i.e. library, internet café, Service BC location)",
              },
              {
                text: "I am using a private computer",
                value: "I am using a private computer",
              },
            ],
          },
        ],
      },
    ],
    showQuestionNumbers: "off",
  };

  formData: object;

  confirm() {
    // this.confirmed = true;
    if (this.survey.completeLastPage()) {
      this.missionService.confirmMission({
        name: "home",
        data: this.survey.data,
      });
      console.log(this.survey);
      this.router.navigateByUrl("hrt/progress");
    }
  }

  ngOnInit() {
    this.initSurvey();
    this.survey = new Survey.Model(this.json);
    // load data from sessionStorage if there is one
    this.survey.data = this.formData;
    // this.survey.showQuestionNumbers = "off"
    Survey.SurveyNG.render("surveyElementHRT", { model: this.survey });
    this.survey.onComplete.add(function (result) {
      document.querySelector("#surveyResult").textContent =
        "Result JSON:\n" + JSON.stringify(result.data, null, 3);
    });
  }

  initSurvey() {
    addQuestionTypes(Survey);
    Survey.defaultBootstrapCss.page.root = "sv_page";
    Survey.defaultBootstrapCss.pageDescription = "sv_page_description";
    Survey.defaultBootstrapCss.page.description = "sv_page_description";
    Survey.defaultBootstrapCss.pageTitle = "sv_page_title";
    Survey.defaultBootstrapCss.page.title = "sv_page_title";
    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.defaultBootstrapCss.question.title = "sv_q_title";
    Survey.defaultBootstrapCss.question.description = "sv_q_description";
    Survey.defaultBootstrapCss.panel.description = "sv_p_description";
    Survey.defaultBootstrapCss.matrixdynamic.button = "btn btn-primary";
    Survey.defaultBootstrapCss.paneldynamic.button = "btn btn-primary";
    Survey.defaultBootstrapCss.paneldynamic.root = "sv_p_dynamic";
    Survey.defaultBootstrapCss.checkbox.item = "sv-checkbox";
    Survey.defaultBootstrapCss.checkbox.controlLabel = "sv-checkbox-label";
    Survey.defaultBootstrapCss.checkbox.materialDecorator = "";
    Survey.defaultBootstrapCss.radiogroup.item = "sv-radio";
    Survey.defaultBootstrapCss.radiogroup.controlLabel = "sv-checkbox-label";
    Survey.defaultBootstrapCss.radiogroup.materialDecorator = "";
    Survey.StylesManager.applyTheme("bootstrap");
  }
}