import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { ImgFormat } from '../../services/img.service';
import { environment } from '../../../environments/environment';
import { DataReadService, PublicHelpersService } from '@kumulus/ng-core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit, OnDestroy {
  public activeLang: string;
  public langSubscription: Subscription;
  public content;
  public logo;

  constructor(
    private dataHelpers: PublicHelpersService,
    private settingsService: SettingsService,
    private dataRService: DataReadService
  ) {}

  public ngOnInit(): void {
    this.settingsService.getSelectedLanguage().then(lg => {
      this.activeLang = lg;
      this.getContent();
    });
    this.langSubscription = this.settingsService.languageChanged.subscribe(lang => {
      this.activeLang = lang;
      this.getContent();
    });
  }

  private getContent(): void {
    // get list of pages filtered by path and lang
    this.dataRService
      .getModules('footer', this.activeLang)
      .then(res => {
        this.content = this.dataHelpers.formatModule(res[0], ImgFormat.ORIGINAL, environment.imgApi);
      })
      .catch(err => console.log(err));
    this.dataRService
      .getModules('logo')
      .then(res => {
        this.logo = this.dataHelpers.formatModule(res[0], ImgFormat.ORIGINAL, environment.imgApi);
      })
      .catch(err => console.log(err));
  }

  public ngOnDestroy(): void {
    this.langSubscription.unsubscribe();
  }
}
