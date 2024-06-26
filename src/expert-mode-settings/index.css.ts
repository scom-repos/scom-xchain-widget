import { Styles } from '@ijstech/components';
const Theme = Styles.Theme.ThemeVars;

export default Styles.style({
  textAlign: 'center',
  $nest: {
    '.modal': {
      borderRadius: '1rem',
      padding: '1rem',
      width: 327
    },
    '.i-modal_header': {
      marginBottom: '1.25rem',
      paddingBottom: '0.75rem',
      borderBottom: `2px solid ${Theme.background.default}`,
      $nest: {
        '&> span': {
          margin: 'auto',
          padding: '0 2rem',
          color: Theme.colors.primary.main,
          fontWeight: 700,
        }
      }
    },
    '.i-modal-close': {
      fill: `${Theme.colors.primary.main} !important`,
    },
    '.expert-content': {
      fontWeight: 'bold',
      $nest: {
        '.warning-box': {
          padding: '0.75rem 1rem',
          marginBottom: '1.25rem',
          background: 'linear-gradient(90deg,#df5869 -19.25%,#bc4c7b 116.5%)',
          border: `1px solid ${Theme.colors.primary.main}`,
          borderRadius: '0.5rem',
        },
        '.warning-box i-label *': {
          color: Theme.text.primary,
          fontSize: '1rem',
        },
        'i-label.warning-text *': {
          color: Theme.colors.secondary.main,
          fontSize: '1.05rem',
        },
        'i-button': {
          padding: '0.75rem',
          margin: '1.25rem 0 0.5rem',
          background: 'transparent linear-gradient(255deg,#e75b66,#b52082) 0% 0% no-repeat padding-box',
        }
      }
    }
  }
})