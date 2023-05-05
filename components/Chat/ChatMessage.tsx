import { SiOpenai } from '@icons-pack/react-simple-icons';
import {
  IconCheck,
  IconCopy,
  IconEdit,
  IconRobot,
  IconTrash,
  IconUser,
} from '@tabler/icons-react';
import { FC, memo, useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { updateConversation } from '@/utils/app/conversation';

import { Message } from '@/types/chat';

import HomeContext from '@/pages/api/home/home.context';

import { CodeBlock } from '../Markdown/CodeBlock';
import { MemoizedReactMarkdown } from '../Markdown/MemoizedReactMarkdown';

import rehypeMathjax from 'rehype-mathjax';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

export interface Props {
  message: Message;
  messageIndex: number;
  onEdit?: (editedMessage: Message) => void;
}

export const ChatMessage: FC<Props> = memo(
  ({ message, messageIndex, onEdit }) => {
    const { t } = useTranslation('chat');

    const {
      state: { selectedConversation, conversations, currentMessage },
      dispatch: homeDispatch,
    } = useContext(HomeContext);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [messageContent, setMessageContent] = useState(message.content);
    const [messagedCopied, setMessageCopied] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const bubbleRef = useRef<HTMLDivElement>(null);

    const toggleEditing = () => {
      setIsEditing(!isEditing);
    };

    const handleInputChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>,
    ) => {
      setMessageContent(event.target.value);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    };

    const handleEditMessage = () => {
      if (message.content != messageContent) {
        if (selectedConversation && onEdit) {
          onEdit({ ...message, content: messageContent });
        }
      }
      setIsEditing(false);
    };

    const handleDeleteMessage = () => {
      if (!selectedConversation) return;

      const { messages } = selectedConversation;
      const findIndex = messages.findIndex((elm) => elm === message);

      if (findIndex < 0) return;

      if (
        findIndex < messages.length - 1 &&
        messages[findIndex + 1].role === 'assistant'
      ) {
        messages.splice(findIndex, 2);
      } else {
        messages.splice(findIndex, 1);
      }
      const updatedConversation = {
        ...selectedConversation,
        messages,
      };

      const { single, all } = updateConversation(
        updatedConversation,
        conversations,
      );
      homeDispatch({ field: 'selectedConversation', value: single });
      homeDispatch({ field: 'conversations', value: all });
    };

    const handlePressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !isTyping && !e.shiftKey) {
        e.preventDefault();
        handleEditMessage();
      }
    };

    const copyOnClick = () => {
      if (!navigator.clipboard) return;

      navigator.clipboard.writeText(message.content).then(() => {
        setMessageCopied(true);
        setTimeout(() => {
          setMessageCopied(false);
        }, 2000);
      });
    };

    useEffect(() => {
      setMessageContent(message.content);
    }, [message.content]);

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'inherit';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [isEditing]);

    return (
      <div
        className={`group mx-auto ${
          message.role === 'assistant' ? 'rounded-2xl p-3' : 'rounded-2xl p-3'
        }`}
        style={{
          overflowWrap: 'anywhere',
          display: 'flex',
          justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
          maxWidth: '710px',
        }}
      >
        <div className="relative flex items-start prose ">
          {message.role === 'assistant' && (
            <div
              className={`h-10 w-10 rounded-xl inline-flex items-center justify-center mr-2 bg-teal-500 text-white flex-shrink-0`}
            >
              <SiOpenai size={30} />
            </div>
          )}
          <div className={`prose flex-grow max-w-full `}>
            {message.role === 'user' ? (
              <div className="flex flex-col items-end">
                {isEditing ? (
                  <div className="prose flex w-full flex-col max-w-full">
                    <textarea
                      ref={textareaRef}
                      className="bg-blue-500 rounded-2xl text-white px-4 py-2"
                      value={messageContent}
                      onChange={handleInputChange}
                      onKeyDown={handlePressEnter}
                      onCompositionStart={() => setIsTyping(true)}
                      onCompositionEnd={() => setIsTyping(false)}
                      style={{
                        fontFamily: 'inherit',
                        fontSize: 'inherit',
                        lineHeight: 'inherit',
                        padding: '10px 12px 10px 12px',
                        margin: '0',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        height: 'auto',
                        minHeight: '56px',
                        maxHeight: '150px',
                        minWidth: bubbleRef.current
                          ? bubbleRef.current.clientWidth + 'px'
                          : '100%',
                        width: '100%',
                        resize: 'vertical',
                        cursor: 'auto',
                      }}
                    />
                    <div className="mt-2 flex justify-center space-x-3">
                      <button
                        className="text-gray-500 hover:text-gray-800 ml-1"
                        onClick={handleEditMessage}
                        disabled={messageContent.trim().length <= 0}
                      >
                        {t('Save & Submit')}
                      </button>
                      <button
                        className="h-[40px] rounded-md border border-neutral-300 px-4 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                        onClick={() => {
                          setMessageContent(message.content);
                          setIsEditing(false);
                        }}
                      >
                        {t('Cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div
                      ref={bubbleRef}
                      className="prose whitespace-pre-wrap flex-1 text-white bg-blue-500 rounded-2xl px-4 py-1.5 w-fit justify-end"
                    >
                      {message.content}
                    </div>
                  </div>
                )}
                {!isEditing && (
                  <div className="mt-1">
                    <div className="md:ml-0 md:flex-row gap-4 md:gap-1 items-center md:items-start justify-start md:justify-start mt-auto">
                      <button
                        className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 rounded-lg px-2 text-sm h-6 inline-flex items-center justify-center border shrink-0 text-center disabled:pointer-events-none border-zinc-300 bg-white border-b-zinc-400/80 active:bg-zinc-200"
                        onClick={toggleEditing}
                      >
                        <IconEdit size={20} />
                      </button>
                      <button
                        className="invisible group-hover:visible focus:visible text-red-500 hover:text-red-700  rounded-lg px-2 text-sm h-6 inline-flex items-center justify-center border shrink-0 text-center disabled:pointer-events-none border-zinc-300 bg-white border-b-zinc-400/80 active:bg-zinc-200"
                        onClick={handleDeleteMessage}
                      >
                        <IconTrash size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-row items-start">
                <div className="bg-zinc-100 rounded-2xl px-4 py-1.5 w-full md:w-auto">
                  <MemoizedReactMarkdown
                    className="prose flex-1"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeMathjax]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');

                        return !inline ? (
                          <CodeBlock
                            key={Math.random()}
                            language={(match && match[1]) || ''}
                            value={String(children).replace(/\n$/, '')}
                            {...props}
                          />
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                      table({ children }) {
                        return (
                          <table className="border-collapse border border-black px-3 py-1 ">
                            {children}
                          </table>
                        );
                      },
                      th({ children }) {
                        return (
                          <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white ">
                            {children}
                          </th>
                        );
                      },
                      td({ children }) {
                        return (
                          <td className="break-words border border-black px-3 py-1 ">
                            {children}
                          </td>
                        );
                      },
                    }}
                  >
                    {message.content}
                  </MemoizedReactMarkdown>
                </div>
                <div className="md:-mr-8 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                  {messagedCopied ? (
                    <IconCheck size={20} className="text-green-500 " />
                  ) : (
                    <button
                      className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 "
                      onClick={copyOnClick}
                    >
                      <IconCopy size={20} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
ChatMessage.displayName = 'ChatMessage';
