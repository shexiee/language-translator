import streamlit as st
import pandas as pd
import json
import os
from translate import Translator
from googletrans import Translator as GoogleTranslator
import time

# List of language codes and names
LANGUAGES = {
    'af': 'Afrikaans', 'am': 'Amharic', 'ar': 'Arabic', 'az': 'Azerbaijani',
    'be': 'Belarusian', 'bg': 'Bulgarian', 'bn': 'Bengali', 'bs': 'Bosnian',
    'ca': 'Catalan', 'ceb': 'Cebuano', 'co': 'Corsican', 'cs': 'Czech', 
    'cy': 'Welsh', 'da': 'Danish', 'de': 'German', 'el': 'Greek', 
    'en': 'English', 'eo': 'Esperanto', 'es': 'Spanish', 'et': 'Estonian',
    'eu': 'Basque', 'fa': 'Persian', 'fi': 'Finnish', 'fil': 'Filipino', 'tl': 'Tagalog',
    'fr': 'French', 'fy': 'Frisian', 'ga': 'Irish', 'gd': 'Scots Gaelic',
    'gl': 'Galician', 'gu': 'Gujarati', 'ha': 'Hausa', 'haw': 'Hawaiian',
    'he': 'Hebrew', 'hi': 'Hindi', 'hmn': 'Hmong', 'hr': 'Croatian',
    'ht': 'Haitian Creole', 'hu': 'Hungarian', 'hy': 'Armenian', 'id': 'Indonesian',
    'ig': 'Igbo', 'is': 'Icelandic', 'it': 'Italian', 'ja': 'Japanese',
    'jw': 'Javanese', 'ka': 'Georgian', 'kk': 'Kazakh', 'km': 'Khmer',
    'kn': 'Kannada', 'ko': 'Korean', 'ku': 'Kurdish', 'ky': 'Kyrgyz',
    'la': 'Latin', 'lb': 'Luxembourgish', 'lo': 'Lao', 'lt': 'Lithuanian',
    'lv': 'Latvian', 'mg': 'Malagasy', 'mi': 'Maori', 'mk': 'Macedonian',
    'ml': 'Malayalam', 'mn': 'Mongolian', 'mr': 'Marathi', 'ms': 'Malay',
    'mt': 'Maltese', 'my': 'Myanmar (Burmese)', 'ne': 'Nepali', 'nl': 'Dutch',
    'no': 'Norwegian', 'ny': 'Chichewa', 'or': 'Odia', 'pa': 'Punjabi',
    'pl': 'Polish', 'ps': 'Pashto', 'pt': 'Portuguese', 'ro': 'Romanian',
    'ru': 'Russian', 'sd': 'Sindhi', 'si': 'Sinhala', 'sk': 'Slovak',
    'sl': 'Slovenian', 'sm': 'Samoan', 'sn': 'Shona', 'so': 'Somali',
    'sq': 'Albanian', 'sr': 'Serbian', 'st': 'Sesotho', 'su': 'Sundanese',
    'sv': 'Swedish', 'sw': 'Swahili', 'ta': 'Tamil', 'te': 'Telugu',
    'tg': 'Tajik', 'th': 'Thai', 'tk': 'Turkmen', 'tr': 'Turkish',
    'tt': 'Tatar', 'ug': 'Uyghur', 'uk': 'Ukrainian', 'ur': 'Urdu',
    'uz': 'Uzbek', 'vi': 'Vietnamese', 'xh': 'Xhosa', 'yi': 'Yiddish',
    'yo': 'Yoruba', 'zh-cn': 'Chinese (Simplified)', 'zh-tw': 'Chinese (Traditional)',
    'zu': 'Zulu'
}

def get_language_code(language_name):
    """Convert language name to language code"""
    for code, name in LANGUAGES.items():
        if name == language_name:
            return code
    return 'en'  # default to English

def translate_text(source_text, src_lang, dest_lang, api):
    """Perform translation using selected API"""
    try:
        if api == "Google Translate":
            translator = GoogleTranslator()
            # Handle empty or whitespace text
            if not source_text or source_text.isspace():
                return ""
                
            # Handle potentially problematic characters
            source_text = source_text.strip()
            
            # For longer texts, break into chunks (Google Translate can handle more text at once)
            if len(source_text) > 5000:
                chunks = [source_text[i:i+5000] for i in range(0, len(source_text), 5000)]
                translated_chunks = []
                for chunk in chunks:
                    result = translator.translate(chunk, src=src_lang, dest=dest_lang)
                    translated_chunks.append(result.text)
                return ' '.join(translated_chunks)
            else:
                result = translator.translate(source_text, src=src_lang, dest=dest_lang)
                return result.text
        else:  # MyMemory
            translator = Translator(from_lang=src_lang, to_lang=dest_lang)
            
            # Handle empty or whitespace text
            if not source_text or source_text.isspace():
                return ""
                
            # For longer texts, break into chunks (MyMemory has character limits)
            if len(source_text) > 500:
                chunks = [source_text[i:i+500] for i in range(0, len(source_text), 500)]
                translated_chunks = []
                for chunk in chunks:
                    translated_chunks.append(translator.translate(chunk))
                return ' '.join(translated_chunks)
            else:
                return translator.translate(source_text)
    except Exception as e:
        return f"Translation Error: {str(e)}"

def save_to_history(source_lang, target_lang, source_text, translated_text, api):
    """Save current translation to history"""
    history = []
    try:
        if os.path.exists('translation_history.json'):
            with open('translation_history.json', 'r', encoding='utf-8') as f:
                history = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        pass
    
    # Add new translation to history
    history.append({
        'source_lang': source_lang,
        'target_lang': target_lang,
        'source_text': source_text,
        'translated_text': translated_text,
        'api': api,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    })
    
    # Save history (limit to 50 entries)
    with open('translation_history.json', 'w', encoding='utf-8') as f:
        json.dump(history[-50:], f, ensure_ascii=False, indent=2)
    
    return history

def load_history():
    """Load translation history"""
    try:
        if os.path.exists('translation_history.json'):
            with open('translation_history.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def display_history(history):
    """Display translation history as a dataframe"""
    if not history:
        st.info("No translation history available.")
        return

    # Extract data for display
    display_data = []
    for entry in history:
        # Get the first 50 characters of source and translated text
        source_preview = entry['source_text'][:50] + "..." if len(entry['source_text']) > 50 else entry['source_text']
        translated_preview = entry['translated_text'][:50] + "..." if len(entry['translated_text']) > 50 else entry['translated_text']
        
        display_data.append({
            'Timestamp': entry.get('timestamp', 'Unknown'),
            'Source Language': entry['source_lang'],
            'Target Language': entry['target_lang'],
            'Source Text': source_preview,
            'Translated Text': translated_preview,
            'API': entry['api']
        })
    
    # Display as dataframe
    df = pd.DataFrame(display_data)
    st.dataframe(df)
    
    # Option to view full translation
    if st.button("View Full Text of Selected Translation"):
        # Get index from session state
        selected_idx = st.session_state.get('selected_idx', None)
        if selected_idx is not None and 0 <= selected_idx < len(history):
            entry = history[selected_idx]
            st.text_area("Original Text", entry['source_text'], height=150)
            st.text_area("Translated Text", entry['translated_text'], height=150)

def main():
    st.set_page_config(
        page_title="Multi-API Language Translator",
        page_icon="🌐",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    st.title("🌐 Language Translator")
    st.markdown("""
    Translate text between 100+ languages using Google Translate or MyMemory API.
    """)
    
    # Initialize session state variables
    if 'selected_idx' not in st.session_state:
        st.session_state.selected_idx = None
    
    if 'quick_src' not in st.session_state:
        st.session_state.quick_src = None
    
    if 'quick_dst' not in st.session_state:
        st.session_state.quick_dst = None
    
    # Sidebar for API selection and history
    with st.sidebar:
        st.header("Settings")
        api = st.selectbox("Translation API:", ["Google Translate", "MyMemory"])
        
        # Language quick filters
        st.subheader("Popular Languages")
        if st.button("English ⟷ Filipino"):
            st.session_state.quick_src = "English"
            st.session_state.quick_dst = "Filipino"
            st.experimental_rerun()
        
        col1, col2 = st.columns(2)
        with col1:
            if st.button("EN ⟷ ES"):
                st.session_state.quick_src = "English"
                st.session_state.quick_dst = "Spanish"
                st.experimental_rerun()
            if st.button("EN ⟷ FR"):
                st.session_state.quick_src = "English"
                st.session_state.quick_dst = "French"
                st.experimental_rerun()
        with col2:
            if st.button("EN ⟷ ZH"):
                st.session_state.quick_src = "English"
                st.session_state.quick_dst = "Chinese (Simplified)"
                st.experimental_rerun()
            if st.button("EN ⟷ JA"):
                st.session_state.quick_src = "English"
                st.session_state.quick_dst = "Japanese"
                st.experimental_rerun()
        
        st.divider()
        
        st.header("Translation History")
        show_history = st.checkbox("Show Translation History")
    
    # Main layout with columns
    col1, col2 = st.columns(2)
    
    # Set default languages or use quick selection
    sorted_langs = sorted(LANGUAGES.values())
    src_index = list(sorted_langs).index("English")
    dst_index = list(sorted_langs).index("Spanish")
    
    # Check if we have a quick language selection to apply
    if st.session_state.quick_src is not None:
        src_index = list(sorted_langs).index(st.session_state.quick_src)
        st.session_state.quick_src = None
    
    if st.session_state.quick_dst is not None:
        dst_index = list(sorted_langs).index(st.session_state.quick_dst)
        st.session_state.quick_dst = None
    
    with col1:
        st.subheader("Source")
        source_lang = st.selectbox("Source Language:", sorted_langs, index=src_index)
        source_text = st.text_area("Enter text to translate:", height=250)
        
        # Add a language detection feature
        if st.button("Detect Language"):
            if source_text.strip():
                try:
                    translator = GoogleTranslator()
                    detection = translator.detect(source_text)
                    if detection.lang in LANGUAGES:
                        detected_lang = LANGUAGES[detection.lang]
                        st.success(f"Detected language: {detected_lang} (confidence: {detection.confidence:.2f})")
                        # Update the source language dropdown
                        source_lang = detected_lang
                    else:
                        st.warning(f"Detected language code '{detection.lang}' is not in our supported languages list.")
                except Exception as e:
                    st.error(f"Language detection error: {str(e)}")
            else:
                st.warning("Please enter some text to detect its language.")
    
    with col2:
        st.subheader("Translation")
        target_lang = st.selectbox("Target Language:", sorted_langs, index=dst_index)
        translated_text = st.empty()
        
        # Swap languages button
        if st.button("🔄 Swap Languages"):
            # Store current selections
            temp_src = source_lang
            temp_text = source_text
            
            # Set session state to update on rerun
            st.session_state.quick_src = target_lang
            st.session_state.quick_dst = temp_src
            
            # If we have a translation, swap the text too
            if 'latest_translation' in st.session_state and st.session_state.latest_translation:
                st.session_state.swap_text = st.session_state.latest_translation.get('translated_text', '')
            
            st.experimental_rerun()
    
    # Action buttons for translation
    col_btn1, col_btn2, col_space = st.columns([1, 1, 2])
    
    with col_btn1:
        translate_btn = st.button("Translate", type="primary", use_container_width=True)
    
    with col_btn2:
        save_btn = st.button("Save to History", use_container_width=True)
    
    # Check if we need to restore swapped text
    if hasattr(st.session_state, 'swap_text') and st.session_state.swap_text:
        source_text = st.session_state.swap_text
        # Clear it after use
        st.session_state.swap_text = ''
    
    # Character counter
    if source_text:
        st.caption(f"Character count: {len(source_text)} | Word count: {len(source_text.split())}")
    
    # Handle translation
    if translate_btn and source_text:
        with st.spinner('Translating...'):
            src_lang_code = get_language_code(source_lang)
            dest_lang_code = get_language_code(target_lang)
            result = translate_text(source_text, src_lang_code, dest_lang_code, api)
            translated_text.text_area("Translation result:", value=result, height=250)
            
            # Show character count for translation
            if result and not result.startswith("Translation Error"):
                st.caption(f"Translated character count: {len(result)} | Word count: {len(result.split())}")
            
            # Save translation result to session state for later saving if requested
            st.session_state.latest_translation = {
                'source_lang': source_lang,
                'target_lang': target_lang,
                'source_text': source_text,
                'translated_text': result,
                'api': api
            }
    
    # Handle saving to history
    if save_btn:
        if hasattr(st.session_state, 'latest_translation') and st.session_state.latest_translation:
            trans = st.session_state.latest_translation
            save_to_history(
                trans['source_lang'], 
                trans['target_lang'], 
                trans['source_text'], 
                trans['translated_text'], 
                trans['api']
            )
            st.success("Translation saved to history!")
        else:
            st.warning("No translation available to save. Please translate some text first.")
    
    # Display history if requested
    if show_history:
        st.divider()
        st.header("Translation History")
        history = load_history()
        
        if history:
            display_history(history)
            
            # Allow loading a historical translation
            st.subheader("Load from History")
            
            # Create options list with description
            options = [f"{h['source_lang']} → {h['target_lang']}: {h['source_text'][:30]}..." for h in history]
            selected_option = st.selectbox("Select a translation to load:", options)
            
            if st.button("Load Selected Translation"):
                selected_idx = options.index(selected_option)
                st.session_state.selected_idx = selected_idx
                
                # Load the selected translation
                selected = history[selected_idx]
                st.session_state.latest_translation = selected
                
                # Display in the main interface
                source_text = selected['source_text']
                st.session_state.source_lang = selected['source_lang']
                st.session_state.target_lang = selected['target_lang']
                st.session_state.api = selected['api']
                
                # Force a rerun to update all widgets
                st.rerun()
        else:
            st.info("No translation history available.")

if __name__ == "__main__":
    main()