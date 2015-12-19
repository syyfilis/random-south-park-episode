'use strict';

import {RandomEpisode} from './RandomEpisode';
import {hasToInitSeriesInfo, initSeriesInfoAnd, markAsWatched} from './Storage';

export class Extension {

    constructor() {
        // TODO @tonis sometimes chrome.browserAction is undefined at start, resolve issue
        chrome.browserAction.onClicked.addListener(() => this.continueOnClick());
    }

    continueOnClick() {
        // TODO @tonis we should init before click, maybe difficult, PS to test initing turn this if off
        if (hasToInitSeriesInfo())
            initSeriesInfoAnd(() => this.show());
        else
            this.show();
    }

    show() {
        var random = new RandomEpisode().generate();
        var url = 'http://southpark.cc.com/full-episodes/s' + random.season + 'e' + random.episode;

        markAsWatched(random.season, random.episode);
        this.openEpisode(url);
    }

    openEpisode(url) {
        chrome.tabs.getSelected(null, function (tab) {
            var activeUrl = tab.url;

            if (activeUrl == 'chrome://newtab/' || /http:\/\/southpark.cc.com\/full-episodes/.test(activeUrl))
                chrome.tabs.update(tab.id, {url: url});
            else
                chrome.tabs.create({ url: url });
        });
    }
}