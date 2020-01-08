import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImgFormat, ImgService } from '../../services/img.service';
import { DataReadService } from '@kumulus/ng-core';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';

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
    private router: Router,
    private route: ActivatedRoute,
    private settingsService: SettingsService,
    private imgService: ImgService
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
          this.content = {};
          for (const el of res[0].fieldValues) {
            const val =
              typeof el.value === 'string' && el.type === 'IMAGE'
                ? this.imgService.getImage(ImgFormat.ORIGINAL, el.value)
                : el.value;
            this.content[el.label] = {
              type: el.type,
              value: val,
            };
            if (typeof el.value === 'string' && el.type === 'BLOG') {
              this.getBlogPostRoll(el.value);
            }
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
          const postContent = {
            path: post.path,
            date: post.date,
            typeName: post.typeName,
          };
          for (const el of post.fieldValues) {
            const val =
              typeof el.value === 'string' && el.type === 'IMAGE'
                ? this.imgService.getImage(ImgFormat.THUMBNAIL, el.value)
                : el.value;
            postContent[el.label] = {
              type: el.type,
              value: val,
            };
          }
          return postContent;
        });
      })
      .catch(err => console.log(err));
  }

  public ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
