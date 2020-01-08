import { Component, OnDestroy, OnInit } from '@angular/core';
import { FooterModuleTemplate, ModuleLoaderService } from '../../services/module-loader.service';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { ImgFormat } from '../../services/img.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit, OnDestroy {
  public footerInAllLanguages = [];
  public imgFormat = ImgFormat.ORIGINAL;
  public displayedFooter: FooterModuleTemplate;
  public selectedLanguage;
  public subscription: Subscription;

  constructor(private moduleLoaderService: ModuleLoaderService, private settingsService: SettingsService) {}

  public ngOnInit(): void {
    this.settingsService.getSelectedLanguage().then(lg => {
      console.log('footer');
      this.selectedLanguage = lg;
    });
    this.subscription = this.settingsService.languageChanged.subscribe(lg => {
      this.selectedLanguage = lg;
      this.displayedFooter = this.footerInAllLanguages.find(el => el.lang === lg);
    });

    this.moduleLoaderService.getFooter().then(res => {
      this.footerInAllLanguages = res;
      this.displayedFooter = this.footerInAllLanguages.find(el => el.lang === this.selectedLanguage);
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
