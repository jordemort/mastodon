import { injectIntl } from 'react-intl';

import { connect } from 'react-redux';

import { showAlertForError } from '../../../actions/alerts';
import { initBlockModal } from '../../../actions/blocks';
import {
  replyCompose,
  quoteCompose,
  mentionCompose,
  directCompose,
} from '../../../actions/compose';
import {
  toggleReblog,
  toggleFavourite,
  pin,
  unpin,
} from '../../../actions/interactions';
import { openModal } from '../../../actions/modal';
import { initMuteModal } from '../../../actions/mutes';
import { initReport } from '../../../actions/reports';
import {
  muteStatus,
  unmuteStatus,
  deleteStatus,
} from '../../../actions/statuses';
import { deleteModal } from '../../../initial_state';
import { makeGetStatus } from '../../../selectors';
import DetailedStatus from '../components/detailed_status';

const messages = defineMessages({
  deleteConfirm: { id: 'confirmations.delete.confirm', defaultMessage: 'Delete' },
  deleteMessage: { id: 'confirmations.delete.message', defaultMessage: 'Are you sure you want to delete this status?' },
  quoteConfirm: { id: 'confirmations.quote.confirm', defaultMessage: 'Quote' },
  quoteMessage: { id: 'confirmations.quote.message', defaultMessage: 'Quoting now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
  redraftConfirm: { id: 'confirmations.redraft.confirm', defaultMessage: 'Delete & redraft' },
  redraftMessage: { id: 'confirmations.redraft.message', defaultMessage: 'Are you sure you want to delete this status and re-draft it? Favorites and boosts will be lost, and replies to the original post will be orphaned.' },
  replyConfirm: { id: 'confirmations.reply.confirm', defaultMessage: 'Reply' },
  replyMessage: { id: 'confirmations.reply.message', defaultMessage: 'Replying now will overwrite the message you are currently composing. Are you sure you want to proceed?' },
});

const makeMapStateToProps = () => {
  const getStatus = makeGetStatus();

  const mapStateToProps = (state, props) => ({
    status: getStatus(state, props),
    domain: state.getIn(['meta', 'domain']),
    settings: state.get('local_settings'),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch) => ({

  onReply (status) {
    dispatch((_, getState) => {
      let state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal({ modalType: 'CONFIRM_REPLY', modalProps: { status } }));
      } else {
        dispatch(replyCompose(status));
      }
    });
  },

  onQuote (status, router) {
    dispatch((_, getState) => {
      let state = getState();
      if (state.getIn(['compose', 'text']).trim().length !== 0) {
        dispatch(openModal('CONFIRM', {
          message: intl.formatMessage(messages.quoteMessage),
          confirm: intl.formatMessage(messages.quoteConfirm),
          onConfirm: () => dispatch(quoteCompose(status, router)),
        }));
      } else {
        dispatch(quoteCompose(status, router));
      }
    });
  },

  onModalReblog (status, privacy) {
    dispatch(reblog({ statusId: status.get('id'), visibility: privacy }));
  },

  onReblog (status, e) {
    dispatch(toggleReblog(status.get('id'), e.shiftKey));
  },

  onFavourite (status, e) {
    dispatch(toggleFavourite(status.get('id'), e.shiftKey));
  },

  onPin (status) {
    if (status.get('pinned')) {
      dispatch(unpin(status));
    } else {
      dispatch(pin(status));
    }
  },

  onEmbed (status) {
    dispatch(openModal({
      modalType: 'EMBED',
      modalProps: {
        id: status.get('id'),
        onError: error => dispatch(showAlertForError(error)),
      },
    }));
  },

  onDelete (status, withRedraft = false) {
    if (!deleteModal) {
      dispatch(deleteStatus(status.get('id'), withRedraft));
    } else {
      dispatch(openModal({ modalType: 'CONFIRM_DELETE_STATUS', modalProps: { statusId: status.get('id'), withRedraft } }));
    }
  },

  onDirect (account) {
    dispatch(directCompose(account));
  },

  onMention (account) {
    dispatch(mentionCompose(account));
  },

  onOpenMedia (media, index, lang) {
    dispatch(openModal({
      modalType: 'MEDIA',
      modalProps: { media, index, lang },
    }));
  },

  onOpenVideo (media, lang, options) {
    dispatch(openModal({
      modalType: 'VIDEO',
      modalProps: { media, lang, options },
    }));
  },

  onBlock (status) {
    const account = status.get('account');
    dispatch(initBlockModal(account));
  },

  onReport (status) {
    dispatch(initReport(status.get('account'), status));
  },

  onMute (account) {
    dispatch(initMuteModal(account));
  },

  onMuteConversation (status) {
    if (status.get('muted')) {
      dispatch(unmuteStatus(status.get('id')));
    } else {
      dispatch(muteStatus(status.get('id')));
    }
  },

});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(DetailedStatus));
