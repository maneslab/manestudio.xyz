
import ReactMarkdown from 'react-markdown'


const MarkdownArticle = ({ children }) => {
    return <article class="prose max-w-screen-lg">
        <ReactMarkdown>
        {children}
        </ReactMarkdown>
    </article>
}; 

export default MarkdownArticle; 