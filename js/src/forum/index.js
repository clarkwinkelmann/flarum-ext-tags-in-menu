import app from 'flarum/app';
import {extend} from 'flarum/extend';
import SessionDropdown from 'flarum/components/SessionDropdown';
import TagLinkButton from 'flarum/tags/components/TagLinkButton';
import Separator from 'flarum/components/Separator';
import sortTags from 'flarum/tags/utils/sortTags';
import abbreviateNumber from 'flarum/utils/abbreviateNumber';

export class TagLinkButtonWithDiscussionCount extends TagLinkButton {
    view() {
        const view = super.view();

        const tag = this.props.tag;

        if (tag) {
            view.children.push(m('span.discussionCount', ' ' + abbreviateNumber(tag.discussionCount())));
        }

        return view;
    }
}

app.initializers.add('clarkwinkelmann/flarum-ext-tags-in-menu', () => {
    extend(SessionDropdown.prototype, 'items', function (items) {
        const tags = sortTags(app.store.all('tags')).filter(tag => tag.isPrimary());

        // Any number between -1 and -99 will go below must of the content, but above the logout button
        items.add('tagsInMenu-separator', Separator.component(), -51);

        items.add('tagsInMenu', m('ul.TagsInMenu', tags.map(tag => m('li', TagLinkButtonWithDiscussionCount.component({
            tag,
            params: {},
        })))), -52);
    });
});
