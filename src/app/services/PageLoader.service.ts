import { Injectable } from '@angular/core';
import { DataReadService, PageModel, PostModel } from '@kumulus/ng-core';
import * as _ from 'lodash';
import { ImgFormat, ImgService } from './img.service';

export interface HomepageTemplate {
  lang: string;
  path: string;
  title: string;
  coverImg: string;
  calltoactionTitle: string;
  calltoactionButtonlabel: string;
  calltoactionButtonLink: string;
  calltoactionCoverImage: string;
  coverImgSrc: string;
  calltoactionCoverImgSrc: string;
  blog: string;
  blogposts: PostModel[];
}

@Injectable({
  providedIn: 'root',
})
export class PageLoaderService {
  private pageAndTranslations: PageModel[] | HomepageTemplate[];

  constructor(private dataRService: DataReadService, private imgService: ImgService) {}

  public getPageAndTranslations(path: string): Promise<PageModel[] | HomepageTemplate[]> {
    console.log('getting', path);
    return this.dataRService.getPageByPathAndTranslations(path).then(pages => {
      if (path === 'homepage') {
        this.pageAndTranslations = this.parseHomepage(pages);
      } else {
        this.pageAndTranslations = pages;
      }
      return this.pageAndTranslations;
    });
  }

  public getPostAndTranslations(path: string) {
    return this.dataRService.getPostByPathAndTranslations(path).then(posts => {
      return posts;
    });
  }

  public getInitialPage() {
    // the page we were in before accessing its posts
    return _.cloneDeep(this.pageAndTranslations);
  }

  public setInitialPage(path: string) {
    if (!this.pageAndTranslations) {
      this.getPageAndTranslations(path).then();
    }
  }

  public parseHomepage(pages: PageModel[]): HomepageTemplate[] {
    const toReturn = [];
    pages.map(page => {
      const content: HomepageTemplate = {
        lang: page.lang,
        path: page.path,
        title: '',
        coverImg: '',
        calltoactionTitle: '',
        calltoactionButtonlabel: '',
        calltoactionButtonLink: '',
        calltoactionCoverImage: '',
        coverImgSrc: '',
        calltoactionCoverImgSrc: '',
        blog: '',
        blogposts: [],
      };
      page.fieldValues.forEach(fv => {
        content[fv.label] = fv.value;
      });
      content.coverImgSrc = this.imgService.getImage(ImgFormat.ORIGINAL, content.coverImg);
      content.calltoactionCoverImgSrc = this.imgService.getImage(ImgFormat.ORIGINAL, content.calltoactionCoverImage);
      this.dataRService
        .getPostsByLangAndPostRollType(content.blog, page.lang)
        .then(posts => {
          content.blogposts = posts;
        })
        .catch(err => console.log(err));
      toReturn.push(content);
    });
    return toReturn;
  }
}
