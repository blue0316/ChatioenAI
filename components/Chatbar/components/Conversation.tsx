import {
  IconCheck,
  IconMessage,
  IconPencil,
  IconStar,
  IconStarFilled,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import {
  DragEvent,
  KeyboardEvent,
  MouseEventHandler,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Conversation } from '@/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import SidebarActionButton from '@/components/Buttons/SidebarActionButton';
import ChatbarContext from '@/components/Chatbar/Chatbar.context';

interface Props {
  conversation: Conversation;
}

interface IconProps {
  icon: string;
  favorite: boolean;
  handleToggle: Function;
}

const LeftIcon = (props: IconProps) => {
  const status = props.icon;
  const favorite = props.favorite;
  const toggle = props.handleToggle;

  const toggleFavorite = () => {};

  return (
    <div
      onClick={() => {
        toggle();
      }}
    >
      {favorite && <IconStarFilled style={{ color: '#f59f00' }} size={18} />}
      {!favorite && status == 'msg' && <IconMessage size={18} />}
      {!favorite && status == 'star' && <IconStar size={18} />}
    </div>
  );
};

export const ConversationComponent = ({ conversation }: Props) => {
  const {
    state: { selectedConversation, messageIsStreaming },
    handleSelectConversation,
    handleUpdateConversation,
  } = useContext(HomeContext);

  const { handleDeleteConversation } = useContext(ChatbarContext);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [iconImage, setIconImage] = useState('msg');

  const handleToggleFavorite = (conversation: Conversation) => {
    handleUpdateConversation(conversation, {
      key: 'favorite',
      value: !conversation.favorite,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      selectedConversation && handleRename(selectedConversation);
    }
  };

  const handleDragStart = (
    e: DragEvent<HTMLButtonElement>,
    conversation: Conversation,
  ) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('conversation', JSON.stringify(conversation));
    }
  };

  const handleRename = (conversation: Conversation) => {
    if (renameValue.trim().length > 0) {
      handleUpdateConversation(conversation, {
        key: 'name',
        value: renameValue,
      });
      setRenameValue('');
      setIsRenaming(false);
    }
  };

  const handleConfirm: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    if (isDeleting && !isRenaming) {
      handleDeleteConversation(conversation);
    } else if (isRenaming) {
      handleRename(conversation);
    }
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleCancel: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(false);
    setIsRenaming(false);
  };

  const handleOpenRenameModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    selectedConversation && setRenameValue(selectedConversation.name);
  };
  const handleOpenDeleteModal: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.stopPropagation();
    setIsDeleting(true);
  };

  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  return (
    <div
      className="relative flex items-center"
      onMouseOver={() => {
        setIconImage('star');
      }}
      onMouseLeave={(e) => {
        setIconImage('msg');
      }}
    >
      {isRenaming && selectedConversation?.id === conversation.id ? (
        <div className="flex w-full items-center gap-3 rounded-lg bg-white p-3">
          <IconMessage size={18} />
          <textarea
            className="mr-12 flex-1 overflow-hidden overflow-ellipsis min-h-[50px] border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-black outline-none focus:border-neutral-100"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>
      ) : (
        <button
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm text-black transition-colors duration-200 hover:bg-white ${
            messageIsStreaming ? 'disabled:cursor-not-allowed' : ''
          } ${selectedConversation?.id === conversation.id ? 'bg-white' : ''}`}
          onClick={() => handleSelectConversation(conversation)}
          disabled={messageIsStreaming}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, conversation)}
        >
          <IconMessage size={18} className="min-w-[18px]" />
          <div className="flex-1">
            <div className="relative max-h-7 max-w-[180px] flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[16px] font-bold leading-3 pr-1 py-2">
              {conversation.name}
            </div>
            {conversation.messages.length > 0 && (
              <div
                className={`relative max-h-5 flex-1 overflow-hidden max-w-[180px] text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 ${
                  selectedConversation?.id === conversation.id
                    ? 'pr-12'
                    : 'pr-1'
                }`}
              >
                {conversation.messages[0].content}
              </div>
            )}
          </div>
        </button>
      )}

      {(isDeleting || isRenaming) &&
        selectedConversation?.id === conversation.id && (
          <div className="absolute top-2 right-1 z-10 flex text-gray-300">
            <SidebarActionButton handleClick={handleCancel}>
              <IconX size={18} className="hover:text-red-400" />
            </SidebarActionButton>
            <SidebarActionButton handleClick={handleConfirm}>
              <IconCheck size={18} className="hover:text-green-400" />
            </SidebarActionButton>
          </div>
        )}

      {selectedConversation?.id === conversation.id &&
        !isDeleting &&
        !isRenaming && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <SidebarActionButton
              handleClick={handleOpenRenameModal}
              hoverColor="green"
            >
              <IconPencil size={18} />
            </SidebarActionButton>
            <SidebarActionButton
              handleClick={handleOpenDeleteModal}
              hoverColor="red"
            >
              <IconTrash size={18} />
            </SidebarActionButton>
          </div>
        )}
    </div>
  );
};
