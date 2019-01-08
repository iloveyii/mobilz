<?php
/**
 * BootCrumb class file.
 * @author Christoffer Niska <ChristofferNiska@gmail.com>
 * @copyright Copyright &copy; Christoffer Niska 2011-
 * @license http://www.opensource.org/licenses/bsd-license.php New BSD License
 * @package bootstrap.widgets
 */

Yii::import('zii.widgets.CBreadcrumbs');

/**
 * Bootstrap breadcrumb widget.
 */
class BootBreadcrumbs extends CBreadcrumbs
{
    public $notMeBreadcrumbs;
    
	/**
	 * @var string the separator between links in the breadcrumbs (defaults to ' / ').
	 */
	public $separator = '/';

	/**
	 * Initializes the widget.
	 */
	public function init()
	{
		$classes = 'breadcrumb';
		if (isset($this->htmlOptions['class']))
			$this->htmlOptions['class'] .= ' '.$classes;
		else
			$this->htmlOptions['class'] = $classes;
	}

	/**
	 * Renders the content of the widget.
	 * @throws CException
	 */
	public function run()
	{
		if (empty($this->links))
			return;

		$links = array();

		if (!isset($this->homeLink))
		{
			// $content = CHtml::link(Yii::t('bootstrap', 'Home'), Yii::app()->homeUrl, array('class'=>'btn btn-default'));
			$content = CHtml::link(Yii::t('bootstrap', 'Home'), '/home', array('class'=>'btn btn-default'));
			$links[] = $this->renderItem($content);
			// $links[] = $this->renderItem($content, FALSE, '/');
		}
		else if ($this->homeLink !== false) {
            $label = Yii::t('bootstrap', 'Home');
            $content = CHtml::link($this->encodeLabel ? CHtml::encode($label) : $label, $this->homeLink,  array('class'=>'btn btn-default'));
			$links[] = $this->renderItem($content, FALSE, '/');
        }

		foreach ($this->links as $label => $url)
		{
			if (is_string($label) || is_array($url))
			{
				$content = CHtml::link($this->encodeLabel ? CHtml::encode($label) : $label, $url,  array('class'=>'btn btn-default'));
				$links[] = $this->renderItem($content,FALSE , $label);
			}
			else
				$links[] = $this->renderItem($this->encodeLabel ? CHtml::encode($url) : '<span class="btn btn-default">' . $url . '</span>', true, $label);
		}

		echo CHtml::openTag('ul', $this->htmlOptions);
		echo implode('', $links);
		echo '</ul>';
	}

	/**
	 * Renders a single breadcrumb item.
	 * @param string $content the content.
	 * @param boolean $active whether the item is active.
	 * @return string the markup.
	 */
	protected function renderItem($content, $active = false, $label=FALSE)
	{
		$separator = !$active ? '<span class="divider">'.$this->separator.'</span>' : '';
		
		ob_start();
		echo CHtml::openTag('li', $active ? array('class'=>'active') : array());
		// echo $separator. '&nbsp;' .$content;
        echo 
            '<div class="btn-group" style="margin:5px 0px;">
                <a class="btn btn-default" href="'.$this->notMeBreadcrumbs[$label].'" >';
                    echo '<i class="fa fa-times-circle"></i>' ;
                echo '</a>
                '.$content.'
            </div>' . $separator;
        
		echo '</li>';
		return ob_get_clean();
	}
}
