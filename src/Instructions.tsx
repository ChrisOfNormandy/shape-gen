import './styles/instructions.scss';
import { getClassName } from '@syren-dev-tech/concauses/props';
import { Glyph } from "@syren-dev-tech/confects/buttons";
import { MarkdownRenderer } from "@syren-dev-tech/confects-md/markdown";
import { ThemeOptions } from '@syren-dev-tech/confetti/themes';
import { useState } from "react";

export default function Instructions() {

    const [storedShow, setStoredShow] = useState(localStorage.getItem('show_instructions'));
    const [show, setShow] = useState(storedShow !== 'false');

    return <div className='instructions-wrapper'>
        {
            show &&
            <div className={getClassName('instructions', new ThemeOptions({ background: { style: 'main' } }).toClassName())}>
                <MarkdownRenderer href='/shape-gen/instructions.md' />

                <div className='no-open'>
                    <Glyph
                        className='close-btn'
                        icon='x-lg'
                        onClick={() => setShow(prev => !prev)}
                        theme={new ThemeOptions({ background: { style: 'primary' } })}
                    />

                    <div className='startup'>
                        <div>Do not open instructions on startup</div>

                        <Glyph
                            icon={storedShow === 'false' ? 'square-fill' : 'square'}
                            onClick={() => {
                                if (storedShow === 'false') {
                                    localStorage.removeItem('show_instructions');
                                    setStoredShow('')
                                } else {
                                    localStorage.setItem('show_instructions', 'false');
                                    setStoredShow('false');
                                }
                            }}
                            theme={new ThemeOptions({ background: { style: 'primary' } })}
                        />
                    </div>
                </div>
            </div>
        }

        <Glyph
            className='toggle-instructions-btn'
            icon='question-lg'
            onClick={() => setShow(prev => !prev)}
            theme={new ThemeOptions({ background: { style: 'primary' } })}
        />
    </div>
}