import browser from 'browser';

describe('browser', () => {
    describe('onInstallOrUpdate()', () => {
        describe('on Firefox', () => {
            beforeEach(() => {
                window.chrome = {
                    runtime: {}
                };
            });

            it('does nothing', () => {
                expect(browser.onInstallOrUpdate).not.toThrow();
            });
        });

        describe('on Chrome and Opera', () => {
            beforeEach(() => {
                window.chrome = {
                    runtime: {
                        onInstalled: {
                            addListener: jasmine.createSpy('chrome onInstalled addListener')
                        }
                    }
                };
            });

            it('passes callback to chrome', () => {
                const callback = () => {};

                browser.onInstallOrUpdate(callback);

                expect(window.chrome.runtime.onInstalled.addListener).toHaveBeenCalledWith(callback);
            });
        });
    });

    describe('onIconClick()', () => {
        beforeEach(() => {
            window.chrome = {
                browserAction: {
                    onClicked: {
                        addListener: jasmine.createSpy('chrome onClicked addListener')
                    }
                }
            };
        });

        it('passes callback to chrome', () => {
            const callback = () => {};

            browser.onIconClick(callback);

            expect(window.chrome.browserAction.onClicked.addListener).toHaveBeenCalledWith(callback);
        });
    });

    describe('getActiveTab()', () => {
        let queryConfig;
        let queryCallback;

        beforeEach(() => {
            window.chrome = {
                tabs: {
                    query: (config, callback) => {
                        queryConfig = config;
                        queryCallback = callback;
                    }
                }
            };
        });

        it('passes config', () => {
            browser.getActiveTab();

            expect(queryConfig).toEqual({currentWindow: true, active: true});
        });

        it('gives first tab to callback', () => {
            const callback = jasmine.createSpy('getActiveTab() callback');

            browser.getActiveTab(callback);
            queryCallback(['tab 0', 'tab 1']);

            expect(callback).toHaveBeenCalledWith('tab 0');
        });
    });

    describe('isNewTab()', () => {
        it('knows Chrome new tab url', () => {
            expect(browser.isNewTab('chrome://newtab/')).toBeTruthy();
        });

        it('knows Opera new tab url', () => {
            expect(browser.isNewTab('chrome://startpage/')).toBeTruthy();
        });

        it('knows Firefox new tab urls', () => {
            expect(browser.isNewTab('about:blank')).toBeTruthy();
            expect(browser.isNewTab('about:newtab')).toBeTruthy();
        });

        it('knows when is not a new tab', () => {
            expect(browser.isNewTab('chrome://extensions/')).toBeFalsy();
        });
    });

    describe('updateTab()', () => {
        beforeEach(() => {
            window.chrome = {
                tabs: {
                    update: jasmine.createSpy('chrome tabs update')
                }
            };
        });

        it('passes params', () => {
            const tabId = 123;

            browser.updateTab(tabId, 'https://southpark.com');

            expect(window.chrome.tabs.update).toHaveBeenCalledWith(tabId, {url: 'https://southpark.com'});
        });
    });

    describe('openTab()', () => {
        beforeEach(() => {
            window.chrome = {
                tabs: {
                    create: jasmine.createSpy('chrome tabs create')
                }
            };
        });

        it('passes params', () => {
            browser.openTab('https://southpark.com');

            expect(window.chrome.tabs.create).toHaveBeenCalledWith({url: 'https://southpark.com'});
        });
    });

    describe('searchFromHistory()', () => {
        beforeEach(() => {
            jasmine.clock().mockDate(new Date(1993, 9, 26));
        });

        it('returns empty array when search is not supported', () => {
            window.chrome = {history: {}};
            const callback = jasmine.createSpy('search callback');

            browser.searchFromHistory('https://southpark.com', 743806800000, callback);

            expect(callback).toHaveBeenCalledWith([]);
        });

        it('passes params', () => {
            window.chrome = {
                history: {
                    search: jasmine.createSpy('chrome history search')
                }
            };
            const callback = () => {};

            browser.searchFromHistory('https://southpark.com', 743806800000, callback);

            expect(window.chrome.history.search).toHaveBeenCalledWith({
                text: 'https://southpark.com',
                maxResults: 1000,
                startTime: 743806800000
            }, callback);
        });
    });

    describe('local storage', () => {
        it('can set and get data', () => {
            browser.setToStorage({key: 'key', value: {random: 'South Park'}});
            expect(browser.getFromStorage('key')).toEqual({random: 'South Park'});
        });
    });

    describe('canShowNotification()', () => {
        it('does nothing when browser is not supported', () => {
            const callback = jasmine.createSpy('canShowNotification callback');

            window.chrome = {notifications: {}};
            browser.canShowNotification(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('does nothing when permission level is not granted', () => {
            window.chrome = {
                notifications: {
                    getPermissionLevel: (callback) => callback('denied')
                }
            };
            const callback = jasmine.createSpy('canShowNotification callback');

            browser.canShowNotification(callback);

            expect(callback).not.toHaveBeenCalled();
        });

        it('calls back when permission level is granted', () => {
            window.chrome = {
                notifications: {
                    getPermissionLevel: (callback) => callback('granted')
                }
            };
            const callback = jasmine.createSpy('canShowNotification callback');

            browser.canShowNotification(callback);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('createNotification()', () => {
        beforeEach(() => {
            window.chrome = {
                notifications: {
                    create: jasmine.createSpy('create notification')
                }
            };
        });

        it('creates notification with given args', () => {
            browser.createNotification({
                title: 'Hello',
                message: 'How are you?',
                ok: 'Ok',
                cancel: 'Piss off'
            });
            expect(window.chrome.notifications.create).toHaveBeenCalledWith('random-south-park-episode', {
                type: 'basic',
                iconUrl: '../images/icon-48.png',
                title: 'Hello',
                message: 'How are you?',
                buttons: [
                    {title: 'Ok'},
                    {title: 'Piss off'}
                ]
            });
        });
    });

    describe('onNotificationButtonsClick()', () => {
        let onButtonClickedCallback, handleOk, handleCancel;

        beforeEach(() => {
            handleOk = jasmine.createSpy('handleOk');
            handleCancel = jasmine.createSpy('handleCancel');

            window.chrome = {
                notifications: {
                    onButtonClicked: {
                        addListener: (callback) => {
                            onButtonClickedCallback = callback;
                        }
                    }
                }
            };
            browser.onNotificationButtonsClick(handleOk, handleCancel);
        });

        it('listenes first button as Ok button', () => {
            onButtonClickedCallback('random-south-park-episode', 0);
            expect(handleOk).toHaveBeenCalled();
        });

        it('listenes second button as Cancel button', () => {
            onButtonClickedCallback('random-south-park-episode', 1);
            expect(handleCancel).toHaveBeenCalled();
        });

        it('does nothing when notification id is wrong', () => {
            onButtonClickedCallback('asd-notification', 1);
            expect(handleCancel).not.toHaveBeenCalled();
        });
    });

    describe('onNotificationClose()', () => {
        let onClosedCallback, handleClose;

        beforeEach(() => {
            handleClose = jasmine.createSpy('handleClose');

            window.chrome = {
                notifications: {
                    onClosed: {
                        addListener: (callback) => {
                            onClosedCallback = callback;
                        }
                    }
                }
            };
            browser.onNotificationClose(handleClose);
        });

        it('calls back when notification is closed by user', () => {
            onClosedCallback('random-south-park-episode', true);
            expect(handleClose).toHaveBeenCalled();
        });

        it('does nothing when notification id is wrong', () => {
            onClosedCallback('asd-notification', true);
            expect(handleClose).not.toHaveBeenCalled();
        });

        it('does nothing when notification is not closed by user', () => {
            onClosedCallback('random-south-park-episode', false);
            expect(handleClose).not.toHaveBeenCalled();
        });
    });

    describe('clearNotification()', () => {
        beforeEach(() => {
            window.chrome = {
                notifications: {
                    clear: jasmine.createSpy('clear notification')
                }
            };
        });

        it('clears notification with static id', () => {
            browser.clearNotification();
            expect(window.chrome.notifications.clear).toHaveBeenCalledWith('random-south-park-episode');
        });
    });
});
