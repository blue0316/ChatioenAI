import {
  IconCaretDown,
  IconCaretRight,
  IconCheck,
  IconPalette,
  IconPencil,
  IconRefresh,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  KeyboardEvent,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from 'react';

import { FolderInterface, FolderType } from '@/types/folder';

import HomeContext from '@/pages/api/home/home.context';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';

interface Props {
  currentFolder: FolderInterface;
  searchTerm: string;
  handleDrop: (e: any, folder: FolderInterface) => void;
  folderComponent: (ReactElement | undefined)[];
}

const Folder = ({
  currentFolder,
  searchTerm,
  handleDrop,
  folderComponent,
}: Props) => {
  const { handleDeleteFolder, handleUpdateFolder } = useContext(HomeContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenColor, setIsOpenColor] = useState(false);
  const [adClass, setAdClass] = useState<String>(
    currentFolder.color ? currentFolder.color : '',
  );

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename(renameValue);
    }
  };

  const handleRename = (newValue: string) => {
    handleUpdateFolder(currentFolder.id, newValue);
    setRenameValue('');
    setIsRenaming(false);
  };

  const dropHandler = (e: any) => {
    if (e.dataTransfer) {
      setIsOpen(true);

      handleDrop(e, currentFolder);

      e.target.style.background = 'none';

      currentFolder.chatsNumber ? currentFolder.chatsNumber++ : (currentFolder.chatsNumber = 1);

      let newValue;

      if (currentFolder.chatsNumber === 1) {
        newValue = currentFolder.name + ` (${currentFolder.chatsNumber} chats)`;
      } else {
        newValue =
          currentFolder.name.slice(0, 13) +
          `(${currentFolder.chatsNumber} chats)`;
      }

      handleRename(newValue);
    }
  };

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };

  const colorHandler = (adClassname: string) => {
    setAdClass(adClassname);
    setIsOpenColor(false);
    let folders = localStorage.getItem('folders')
      ? JSON.parse(localStorage.getItem('folders')!)
      : [];
    folders = folders.map((item: FolderInterface) => {
      if (item.id == currentFolder.id) {
        let tmp = { ...item };
        tmp['color'] = adClassname;
        return tmp;
      } else {
        return item;
      }
    });
    localStorage.setItem('folders', JSON.stringify(folders));
  };

  return (
    <>
      <div className="relative flex items-center my-1">
        {isRenaming ? (
          <div className="flex w-full items-center gap-3 bg-[#343541]/90 p-3">
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <textarea
              className="mr-12 flex-1 overflow-hidden min-h-[50px] overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-black outline-none focus:border-neutral-100"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyPress={handleKeyPress}
              autoFocus
            />
          </div>
        ) : (
          <button
            className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm text-black transition-colors duration-200 hover:bg-white ${adClass}`}
            onClick={() => setIsOpen(!isOpen)}
            onDrop={(e) => dropHandler(e)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            {isOpen ? (
              <IconCaretDown
                size={18}
                className={
                  adClass && adClass != ''
                    ? ' text-white group-hover:text-black'
                    : ''
                }
              />
            ) : (
              <IconCaretRight
                size={18}
                className={
                  adClass && adClass != ''
                    ? ' text-white group-hover:text-black'
                    : ''
                }
              />
            )}

            <div
              className={
                'relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3' +
                (adClass && adClass != ''
                  ? ' text-white group-hover:text-black'
                  : '')
              }
            >
              {currentFolder.name}
            </div>
          </button>
        )}

        {(isDeleting || isRenaming) && (
          <div className="absolute top-2 right-1 z-10 flex text-gray-300">
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconX size={18} className="hover:text-red-400" />
            </SidebarActionButton>
            <SidebarActionButton
              handleClick={(e) => {
                e.stopPropagation();

                if (isDeleting) {
                  handleDeleteFolder(currentFolder.id);
                } else if (isRenaming) {
                  handleRename(currentFolder.name);
                }

                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconCheck size={18} className="hover:text-green-400" />
            </SidebarActionButton>
          </div>
        )}

        {!isDeleting && !isRenaming && (
          <>
            <div className="absolute right-1 z-10 flex text-gray-300">
              <SidebarActionButton
                handleClick={(e) => {
                  e.stopPropagation();
                  if (!isOpenColor) {
                    setIsOpenColor(true);
                  } else {
                    setIsOpenColor(false);
                  }
                }}
              >
                <IconPalette
                  size={18}
                  className="text-gray-300 transition-colors duration-300 hover:text-pink-800"
                />
              </SidebarActionButton>
              <SidebarActionButton
                handleClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(true);
                  setRenameValue(currentFolder.name);
                }}
              >
                <IconPencil
                  size={18}
                  className="text-gray-300 hover:text-green-400"
                />
              </SidebarActionButton>
              <SidebarActionButton
                handleClick={(e) => {
                  e.stopPropagation();
                  setIsDeleting(true);
                }}
              >
                <IconTrash
                  size={18}
                  className="text-gray-300 hover:text-red-400"
                />
              </SidebarActionButton>
            </div>
            {isOpenColor && (
              <div className="absolute top-10 right-6 p-2 border border-grey-400 border-solid z-50 rounded bg-white">
                <div
                  onClick={() => colorHandler('!bg-red-600')}
                  className="w-4 h-4 bg-red-600 rounded-full transition-scale duration-300 hover:scale-125 mb-2"
                ></div>
                <div
                  onClick={() => colorHandler('!bg-purple-600')}
                  className="w-4 h-4 bg-purple-600 rounded-full transition-scale duration-300 hover:scale-125 mb-2"
                ></div>
                <div
                  onClick={() => colorHandler('!bg-blue-600')}
                  className="w-4 h-4 bg-blue-600 rounded-full transition-scale duration-300 hover:scale-125 mb-2"
                ></div>
                <div
                  onClick={() => colorHandler('!bg-green-600')}
                  className="w-4 h-4 bg-green-600 rounded-full transition-scale duration-300 hover:scale-125 mb-2"
                ></div>
                <div
                  onClick={() => colorHandler('!bg-yellow-600')}
                  className="w-4 h-4 bg-yellow-700 rounded-full transition-scale duration-300 hover:scale-125 mb-2"
                ></div>
                <IconRefresh
                  onClick={() => colorHandler('')}
                  size={18}
                  className="text-gray-800 transition-colors duration-300 hover:text-teal-600"
                />
              </div>
            )}
          </>
        )}
      </div>

      {isOpen ? folderComponent : null}
    </>
  );
};

export default Folder;
