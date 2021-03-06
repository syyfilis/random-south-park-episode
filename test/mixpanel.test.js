import mixpanel from 'mixpanel';

describe('mixpanel', () => {
    let initSpy, trackSpy;

    beforeEach(() => {
        initSpy = jasmine.createSpy('init');
        trackSpy = jasmine.createSpy('track');

        mixpanel.__set__({
            mixpanel: {
                init: initSpy,
                track: trackSpy
            },
            user: {
                getUsageCount: () => 2
            }
        });
    });

    describe('init()', () => {
        it('inits mixpanel with token', () => {
            mixpanel.init();
            expect(initSpy).toHaveBeenCalledWith('e5bd46663199797d872d02137edfdfef');
        });
    });

    describe('trackInstallOrUpdate()', () => {
        it('tracks install when reason is install', () => {
            mixpanel.trackInstallOrUpdate({reason: 'install'});
            expect(trackSpy).toHaveBeenCalledWith('Install extension');
        });

        it('tracks update with previous version nr when reason is update', () => {
            mixpanel.trackInstallOrUpdate({reason: 'update', previousVersion: '2.0.0'});
            expect(trackSpy).toHaveBeenCalledWith('Update extension', {previousVersion: '2.0.0'});
        });
    });

    describe('trackIconClick()', () => {
        it('tracks when user clicks on icon', () => {
            mixpanel.trackIconClick();
            expect(trackSpy).toHaveBeenCalledWith('Icon click', {totalUsage: 2});
        });
    });

    describe('trackShowEpisode()', () => {
        it('tracks when episode is shown with properties', () => {
            mixpanel.trackShowEpisode({season: 2, epsiode: 1});
            expect(trackSpy).toHaveBeenCalledWith('Show episode', {season: 2, epsiode: 1});
        });
    });

    describe('trackShowNotification()', () => {
        it('tracks when notification is shown with properties', () => {
            mixpanel.trackShowNotification({season: 2, epsiode: 1});
            expect(trackSpy).toHaveBeenCalledWith('Show notification', {season: 2, epsiode: 1});
        });
    });

    describe('trackOkNotification()', () => {
        it('tracks user positive response to notification', () => {
            mixpanel.trackOkNotification({season: 2, epsiode: 1});
            expect(trackSpy).toHaveBeenCalledWith('Ok notification', {season: 2, epsiode: 1});
        });
    });

    describe('trackCancelNotification()', () => {
        it('tracks user negative response to notification', () => {
            mixpanel.trackCancelNotification({season: 2, epsiode: 1});
            expect(trackSpy).toHaveBeenCalledWith('Cancel notification', {season: 2, epsiode: 1});
        });
    });
});
