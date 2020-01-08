import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataReadService, ImgFormat, PublicHelpersService } from '@kumulus/ng-core';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
})
export class PageComponent implements OnInit, OnDestroy {
  private pagePath: string;
  public posts: any[];
  public activeLang;
  private langSubscription: Subscription;
  public content: any;
  private pid: string;

  constructor(
    private dataRService: DataReadService,
    private dataHelper: PublicHelpersService,
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService
  ) {}

  public ngOnInit(): void {
    this.route.parent.params.subscribe(param => {
      this.pagePath = param.path;
      this.settingsService.getSelectedLanguage().then(lang => {
        this.activeLang = lang;
        this.getPageContent();
      });
    });
    this.langSubscription = this.settingsService.languageChanged.subscribe(lang => {
      this.activeLang = lang;
      this.settingsService.settings.then(res => {
        const correspondingPage = res.navigation.find(navItem => {
          return navItem[0].pid === this.pid;
        });
        let link;
        if (correspondingPage) {
          link = correspondingPage.find(el => el.lang === lang);
        }
        this.router.navigateByUrl(link ? link.path : '/');
      });
    });
  }

  public getPageContent() {
    // get list of pages filtered by path and lang
    this.dataRService
      .getPages(this.pagePath, this.activeLang)
      .then(res => {
        if (res.length > 0) {
          this.pid = res[0].pid;
          this.content = this.dataHelper.formatPage(res[0], ImgFormat.ORIGINAL, environment.imgApi);
          console.log(this.content);
          if (this.content.blog) {
            this.getBlogPostRoll(this.content.blog.value);
          } else if (this.content.realisations) {
            this.getBlogPostRoll(this.content.realisations.value);
          }
        } else {
          this.router.navigateByUrl('/');
        }
      })
      .catch(err => console.log(err));
  }

  private getBlogPostRoll(name: string): void {
    this.dataRService
      .getPostsByPostRollType(name, this.activeLang)
      .then(res => {
        this.posts = res.map(post => {
          return this.dataHelper.formatPost(post, ImgFormat.THUMBNAIL, environment.imgApi);
        });
      })
      .catch(err => console.log(err));
  }

  public ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
