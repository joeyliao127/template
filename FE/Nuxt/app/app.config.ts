export default defineAppConfig({
    WEBSITE_NAME: '__PROJECT_DISPLAY__',
    WEBSITE_TITLE: '__PROJECT_DISPLAY__',
    WEBSITE_DESC: '__PROJECT_DISPLAY__',

    /**
     * Template Design System(Claude Design handoff)
     * 語意色值由 tailwind.css 的 --ui-* 變數直接釘住(ink/paper),
     * 這裡只指定色階家族與各元件的 slot 樣式。
     */
    ui: {
        colors: {
            primary: 'neutral',
            neutral: 'neutral',
        },
        button: {
            slots: {
                base: ['justify-center font-medium rounded-md transition-colors active:translate-y-[0.5px] active:scale-[0.992]'],
            },
            variants: {
                block: {
                    true: {
                        // 預設 ms-auto 會把 trailing icon 推到最右、文字擠到左邊;
                        // DS 按鈕為「文字 + icon 一起置中」
                        trailingIcon: 'ms-0',
                    },
                },
            },
            compoundVariants: [
                {
                    // DS .t-btn--primary:墨黑底、hover/press 變亮一階(預設 bg-primary/75 在墨黑上會發灰)
                    color: 'primary',
                    variant: 'solid',
                    class: 'bg-[var(--action-primary)] hover:bg-[var(--action-primary-hover)] active:bg-[var(--action-primary-press)] text-[var(--action-primary-text)]',
                },
                {
                    // DS .t-btn--secondary:白底 + 邊框
                    color: 'neutral',
                    variant: 'outline',
                    class: 'bg-[var(--surface-card)] text-[var(--text-primary)] ring-[var(--border-default)] hover:bg-[var(--surface-hover)] hover:ring-[var(--border-strong)] active:bg-[var(--surface-active)]',
                },
                {
                    // DS .t-btn--ghost
                    color: 'neutral',
                    variant: 'ghost',
                    class: 'text-[var(--text-primary)] hover:bg-[var(--surface-hover)] active:bg-[var(--surface-active)]',
                },
            ],
        },
        input: {
            slots: {
                root: 'w-full',
                base: 'rounded-md bg-[var(--surface-card)] hover:not-focus-visible:ring-[var(--border-strong)] focus-visible:shadow-[0_0_0_3px_rgba(9,9,11,0.08)] transition-[color,box-shadow]',
            },
        },
        textarea: {
            slots: {
                root: 'w-full',
                base: 'rounded-md bg-[var(--surface-card)] hover:not-focus-visible:ring-[var(--border-strong)] focus-visible:shadow-[0_0_0_3px_rgba(9,9,11,0.08)] transition-[color,box-shadow]',
            },
        },
        select: {
            slots: {
                base: 'rounded-md bg-[var(--surface-card)] hover:not-focus-visible:ring-[var(--border-strong)] transition-[color,box-shadow]',
                content: 'bg-default ring ring-default rounded-lg shadow-lg',
            },
        },
        popover: {
            slots: {
                content: 'bg-default ring ring-default rounded-lg shadow-lg',
            },
        },
        toast: {
            slots: {
                root: 'bg-default ring ring-default rounded-md shadow-lg',
            },
        },
        modal: {
            slots: {
                content: 'bg-default rounded-xl shadow-xl ring ring-default',
            },
            variants: {
                fullscreen: {
                    false: {
                        // DS dialog 寬度 460px
                        content: 'sm:max-w-[460px] rounded-xl shadow-xl ring ring-default',
                    },
                },
            },
        },
        card: {
            slots: {
                // DS .t-card:邊框做事,不用陰影
                root: 'bg-[var(--surface-card)] rounded-lg ring ring-default shadow-none divide-default',
            },
        },
        badge: {
            slots: {
                // DS .t-badge:mono、大寫、wide tracking
                base: 'font-mono font-medium uppercase tracking-[var(--tracking-wide)] rounded-sm',
            },
        },
        formField: {
            slots: {
                label: 'font-medium text-default',
                error: 'text-[0.8125rem] text-error',
            },
            variants: {
                required: {
                    true: {
                        label: "after:content-['*'] after:ms-0.5 after:text-error",
                    },
                },
            },
        },
    },
})
