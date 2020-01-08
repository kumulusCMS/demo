import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImgFormat } from '../../../services/img.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReadService, PostModel } from '@kumulus/ng-core';
import { PageLoaderService } from '../../../services/PageLoader.service';
import { SettingsService } from '../../../services/settings.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-public-post',
  templateUrl: './post.component.html',
})
export class PublicPostComponent implements OnInit, OnDestroy {
  private postPath: string;
  public post;
  public postInAllLanguages: PostModel[];
  public userSelectedLang;
  public subscription: Subscription;

  public imgFormat = ImgFormat.ORIGINAL;

  constructor(
    private dataRService: DataReadService,
    private route: ActivatedRoute,
    private router: Router,
    private pageLoaderService: PageLoaderService,
    private settingsService: SettingsService,
    private location: Location
  ) {}

  public ngOnInit(): void {
    this.settingsService.getSelectedLanguage().then(lg => {
      this.userSelectedLang = lg;
    });

    this.subscription = this.settingsService.languageChanged.subscribe(lg => {
      this.userSelectedLang = lg;

      this.post = this.postInAllLanguages.find(el => el.lang === lg);
      if (!this.post) {
        this.redirectToPage(); // redirect to the page that contains the posts
      } else {
        const find = this.pageLoaderService.getInitialPage().find(page => page.lang === this.userSelectedLang);
        this.router.navigateByUrl('/' + find.path + '/' + this.post.path);
        // this.location.go('/' + find.path + '/' + this.post.path);
      }
    });

    this.route.params.subscribe(params => {
      this.postPath = params.post;
      this.pageLoaderService.getPostAndTranslations(this.postPath).then(posts => {
        this.postInAllLanguages = posts;
        this.post = this.postInAllLanguages.find(el => el.lang === this.userSelectedLang);
        if (!this.post) {
          this.redirectToPage();
        }
      });
      this.pageLoaderService.setInitialPage(params.path); // to set the mother page and its translations(to at least have their path) in caqse we switch the language of the post and it doesnt exist in that language
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public redirectToPage() {
    // if a post does not exist in a language and the translation of the mother page (the page that references the posts) exists, we redirect to it,
    // if not, we redirect to /
    const find = this.pageLoaderService.getInitialPage().find(page => page.lang === this.userSelectedLang);
    if (!find) {
      this.router.navigateByUrl('/'); // redirect to the page that contains the posts
    } else {
      this.router.navigateByUrl('/' + find.path);
    }
  }
}
