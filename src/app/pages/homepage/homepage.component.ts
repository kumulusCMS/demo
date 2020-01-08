import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImgFormat, ImgService } from '../../services/img.service';
import { DataReadService } from '@kumulus/ng-core';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { HomepageTemplate, PageLoaderService } from '../../services/PageLoader.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit, OnDestroy {
  public content: any;
  public posts: any[];
  public imgFormat: ImgFormat.ORIGINAL;
  public activeLang;
  private langSubscription: Subscription;

  constructor(
    private dataRService: DataReadService,
    private router: Router,
    private imgService: ImgService,
    private settingsService: SettingsService
  ) {}

  public ngOnInit() {
    this.settingsService.getSelectedLanguage().then(lg => {
      this.activeLang = lg;
      this.getPageContent();
    });
    this.langSubscription = this.settingsService.languageChanged.subscribe(lang => {
      this.activeLang = lang;
      this.getPageContent();
    });
  }

  private getPageContent(): void {
    // get list of pages filtered by path and lang
    this.dataRService
      .getPages('homepage', this.activeLang)
      .then(res => {
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
        console.log(this.content);
      })
      .catch(err => console.log(err));
  }

  private getBlogPostRoll(name: string): void {
    this.dataRService
      .getPostsByPostRollType(name, this.activeLang, 2)
      .then(res => {
        this.posts = res.map(post => {
          console.log(post);
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

  public onPostClick(path: string) {
    this.router.navigateByUrl('/' + this.content.path + '/' + path);
  }

  public ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
