import { Icon } from '@mui/material';
import { MDBox, MDTypography } from 'components';
import { CurrentUserContext } from 'contexts';
import { useLocalStorageByUser } from 'hooks';
import { useContext } from 'react';

interface FoldProps<T> {
  storageKey: string;
  title?: string;
  item: T;
  contents: JSX.Element;
  titleBarActionContents?: JSX.Element;
}

export function Fold<T>({
  storageKey,
  title,
  item,
  contents,
  titleBarActionContents = <></>,
}: FoldProps<T>): JSX.Element {
  const { currentUser } = useContext(CurrentUserContext);

  const [folded, setFolded] = useLocalStorageByUser<T[]>(currentUser?.id, storageKey, []);

  const onClickFold = () => {
    setFolded([...folded, item]);
  };

  const onClickUnFold = () => {
    setFolded((folded || []).filter((entry) => entry !== item));
  };

  return (
    <MDBox>
      <MDBox display="flex" alignItems="center">
        <MDTypography
          color="secondary"
          onClick={folded.includes(item) ? () => onClickUnFold() : () => onClickFold()}
          sx={{
            mr: 1,
          }}
        >
          <Icon color="info" sx={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {folded.includes(item) ? 'keyboard_arrow_right' : 'keyboard_arrow_down'}
          </Icon>
        </MDTypography>
        <MDTypography variant="subtitle1" textTransform="capitalize" fontWeight="medium">
          {title}
        </MDTypography>
        {titleBarActionContents}
      </MDBox>
      {!folded.includes(item) && contents}
    </MDBox>
  );
}
