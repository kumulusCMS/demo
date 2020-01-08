import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImgService } from '../../services/img.service';
import { DataReadService, PublicHelpersService, ImgFormat } from '@kumulus/ng-core';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
})
export class HomepageComponent implements OnInit, OnDestroy {
  public content: any;
  public posts: any[];
  public activeLang;
  private langSubscription: Subscription;

  constructor(
    private dataRService: DataReadService,
    private dataHelpers: PublicHelpersService,
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
        this.content = this.dataHelpers.formatPage(res[0], ImgFormat.ORIGINAL, environment.imgApi);
        this.getBlogPostRoll(this.content.blog.value);
      })
      .catch(err => console.log(err));
  }

  private getBlogPostRoll(name: string): void {
    this.dataRService
      .getPostsByPostRollType(name, this.activeLang, 2)
      .then(res => {
        this.posts = res.map(post => {
          return this.dataHelpers.formatPost(post, ImgFormat.THUMBNAIL, environment.imgApi);
        });
      })
      .catch(err => console.log(err));
  }

  public ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
