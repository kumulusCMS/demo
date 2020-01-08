import { Injectable } from '@angular/core';
import { DataReadService, ModuleModel } from '@kumulus/ng-core';

@Injectable({
  providedIn: 'root',
})
export class ModuleLoaderService {
  constructor(private dataRService: DataReadService) {}

  public getLogo(): Promise<string> {
    // here we don't care about the lg, the logo is the same always
    return this.dataRService.getModules('logo').then(modules => {
      return modules[0].fieldValues[0].value as string;
    });
  }

  public getFooter() {
    return this.dataRService.getModuleAndTranslations('footer').then(footers => {
      return this.getLogo().then(logoImg => {
        return this.parseFooters(footers, logoImg);
      });
    });
  }

  public parseFooters(footers: ModuleModel[], logoImg: string): FooterModuleTemplate[] {
    const toReturn = [];
    footers.map(footer => {
      const content: FooterModuleTemplate = {
        logo: logoImg,
        lang: footer.lang,
        calltoactionContactUs: '',
        calltoactionContactUsLink: '',
        calltoactionJoinUs: '',
        calltoactionJoinUsLink: '',
        facebookLink: '',
        twitterLink: '',
        linkedinLink: '',
        githubLink: '',
        phoneNumber: '',
        address: '',
      };
      footer.fieldValues.forEach(fv => {
        if (fv.label !== 'logo') {
          // because we set it already
          content[fv.label] = fv.value;
        }
      });
      toReturn.push(content);
    });

    return toReturn;
  }
}

export interface FooterModuleTemplate {
  logo: string;
  lang: string;
  calltoactionContactUs: string;
  calltoactionContactUsLink: string;
  calltoactionJoinUs: string;
  calltoactionJoinUsLink: string;
  facebookLink: string;
  twitterLink: string;
  linkedinLink: string;
  githubLink: string;
  phoneNumber: string;
  address: string;
}
